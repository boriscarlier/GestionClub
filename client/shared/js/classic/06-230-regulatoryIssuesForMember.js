function regulatoryIssuesForMember(m){
 const issues=[];
 const add=(kind,severity,title,detail,ref)=>issues.push({memberId:m.id,kind,severity,title,detail,ref,name:`${m.last||''} ${m.first||''}`.trim(),license:m.licenseNumber||''});
 const status=norm(m.license||m.status);

 if(!m.licenseNumber || /bloque|refuse|incomplet|attente|suspend/i.test(status)){
   add('license','block','Licence non utilisable ou à confirmer',`Statut : ${m.license||m.status||'non renseigné'}`,'Règlement LRF 2026 — qualification/licence');
 }
 if(isMemberSuspended(m)){
   const dossiers=disciplineForMember(m).filter(d=>isMemberSuspended(m));
   const activeDossier=dossiers[0]||{};
   const issue={memberId:m.id,kind:'discipline',severity:'block',title:'Suspension disciplinaire active',detail:'Le licencié ne doit pas être utilisé tant que la suspension n’est pas purgée.',ref:'Décision disciplinaire importée',name:`${m.last||''} ${m.first||''}`.trim(),license:m.licenseNumber||'',effectDate:activeDossier.effectDate||'',endDate:activeDossier.endDate||''};
   issues.push(issue);
 }else if(memberDisciplineRisk(m).length){
   add('discipline','warn','Situation disciplinaire à vérifier','Une information disciplinaire importée nécessite un contrôle du dossier officiel avant la prochaine rencontre.','Dossier disciplinaire importé / règlement applicable');
 }

 const sub=norm(m.subcategory||m.category),age=ageOnDate(m.birthDate,new Date().toISOString().slice(0,10));
 const youth=sub.match(/u(\d{1,2})/);
 if(youth && age!==null){
   const catAge=Number(youth[1]);
   if(age>catAge) add('upgrade','warn','Catégorie / âge à contrôler',`Âge calculé : ${age} ans pour ${m.subcategory||m.category}.`,'Règlement LRF 2026 — catégories et surclassement');
 }
 const mutation=memberMutationInfo(m);
 if(mutation.hasMutation && !mutation.verified){
   if(!mutation.startDate){
    add('transfer','warn','Cachet mutation — date de début à vérifier',
      `Cachet : ${mutation.code||'—'} • ${mutation.label||'—'}. Aucune date de début exploitable n’est importée.`,
      'Fichier licences — cachet / règlement LRF applicable');
   }else{
    issues.push({
     memberId:m.id,kind:'transfer',severity:'warn',
     title:'Cachet mutation — période à vérifier',
     detail:`${mutation.code||'—'} • ${mutation.label||'—'} • ${formatDisciplineDate(mutation.startDate)} → ${mutation.endDate?formatDisciplineDate(mutation.endDate):'—'}`,
     ref:'Fichier licences — cachet / règlement LRF applicable',
     name:`${m.last||''} ${m.first||''}`.trim(),license:m.licenseNumber||'',
     effectDate:mutation.startDate,endDate:mutation.endDate||''
    });
   }
 }
 return issues.map(i=>{
  if(!i.effectDate)i.effectDate=m.effectDate||m.validFrom||m.startDate||'';
  if(!i.endDate)i.endDate=m.endDate||m.validTo||m.expiryDate||m.expirationDate||'';
  return i;
 });
}

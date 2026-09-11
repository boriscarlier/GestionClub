function disciplineConsequences(d){
 const out=[];

 if(d.redCard){
  out.push({
   type:'pending',
   title:'Exclusion — décision à vérifier',
   text:'Une exclusion est enregistrée dans les données. Vérifier le dossier officiel avant de conclure à une durée ou à une nature de sanction.',
   ref:'Donnée importée — contrôle administratif requis'
  });
 }

 if(Number(d.yellowCards||0)>0){
  out.push({
   type:'pending',
   title:`${Number(d.yellowCards||0)} avertissement(s) enregistré(s)`,
   text:'Information issue du dossier importé. Aucun cumul n’est transformé automatiquement en suspension.',
   ref:'Donnée importée'
  });
 }

 if(d.decision){
  out.push({
   type:'automatic',
   title:'Décision disciplinaire enregistrée',
   text:String(d.decision)+(d.effectDate?` — effet : ${formatDisciplineDate(d.effectDate)}`:'')+(d.endDate?` → ${formatDisciplineDate(d.endDate)}`:''),
   ref:'Décision présente dans le dossier importé'
  });
 }
 return out;
}

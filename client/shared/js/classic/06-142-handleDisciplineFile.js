async function handleDisciplineFile(event){
 const file=event.target.files&&event.target.files[0];if(!file)return;
 const box=document.getElementById('disciplineImportStatus');
 try{
  if(!window.XLSX)throw new Error('Lecteur Excel indisponible.');
  const ab=await file.arrayBuffer(),wb=XLSX.read(ab,{cellDates:true});
  const ws=wb.Sheets[wb.SheetNames[0]];
  const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:false,dateNF:'yyyy-mm-dd'});
  if(!rows.length)throw new Error('Fichier vide.');
  const headers=rows[0].map(String);
  const required=['Type dossier_2','Statut dossier','Numéro dossier_2','Numéro match','Numéro personne','Nom, prénom personne'];
  const missing=required.filter(x=>disciplineHeaderIndex(headers,x)<0);
  if(missing.length)throw new Error('Colonnes manquantes : '+missing.join(', '));

  const imported=rows.slice(1).filter(r=>r&&r.some(v=>String(v??'').trim()!=='')).map(r=>normalizeDisciplineRow(r,headers));
  let added=0,updated=0;
  imported.forEach(rec=>{
   const existing=(state.discipline||[]).find(x=>String(x.dossierNumber)===String(rec.dossierNumber));
   if(existing){Object.assign(existing,rec);updated++;}
   else{state.discipline.push(rec);added++;}
  });

  recordImport('discipline',{
   filename:file.name||'Dossiers discipline',
   itemCount:(state.discipline||[]).length,
   source:'Import Dossiers / Discipline',
   note:`${imported.length} dossier(s) lus, ${added} ajout(s), ${updated} mise(s) à jour`
  });

  save();
  if(typeof renderImportWatch==='function')renderImportWatch();
  const linkedMembers=imported.filter(r=>r.licenseNumbers&&r.licenseNumbers.length).length;
  const linkedMatches=imported.filter(r=>r.matchId).length;
  box.className='import-status ok';
  box.innerHTML=`<strong>Import terminé</strong><div class="tiny">${imported.length} dossier(s) • ${added} ajouté(s) • ${updated} mis à jour • ${linkedMembers} rattaché(s) à une licence • ${linkedMatches} rattaché(s) à un match.</div>`;
  renderDiscipline();
  setTimeout(()=>{
   goTo('importwatch');
   if(typeof renderImportWatch==='function')renderImportWatch();
  },150);
 if(currentMemberId)renderMemberDetail();
 }catch(err){
  box.className='import-status err';box.textContent='Erreur : '+(err.message||err);
 }
}

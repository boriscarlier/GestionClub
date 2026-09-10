function runUnifiedImport(){
 const target=document.getElementById('importTarget')?.value||'members';
 if(target==='discipline'){
  if(!unifiedSpecialPrepared||!window.__unifiedDisciplineRows)return toast('Import','Chargez un fichier discipline valide.');
  const rows=window.__unifiedDisciplineRows,headers=window.__unifiedDisciplineHeaders;
  const imported=rows.slice(1).filter(r=>r&&r.some(v=>String(v??'').trim()!=='')).map(r=>normalizeDisciplineRow(r,headers));
  let added=0,updated=0;
  imported.forEach(rec=>{
   const existing=(state.discipline||[]).find(x=>String(x.dossierNumber)===String(rec.dossierNumber));
   if(existing){Object.assign(existing,rec);updated++;} else {state.discipline.push(rec);added++;}
  });
  recordImport('discipline',{filename:unifiedSpecialFile?.name||'Dossiers discipline',itemCount:state.discipline.length,source:'Import Dossiers / Discipline',note:`${imported.length} lus • ${added} ajoutés • ${updated} mis à jour`});
  state.importHistory.unshift({id:uid('ih'),file:unifiedSpecialFile?.name||'Dossiers discipline',target:'Dossiers / Discipline',strategy:'mise à jour',date:new Date().toLocaleString('fr-FR'),read:imported.length,added,updated,skipped:0});
  save(); renderImportHistory();
  document.getElementById('impRead').textContent=imported.length;
  document.getElementById('impAdded').textContent=added;
  document.getElementById('impUpdated').textContent=updated;
  document.getElementById('impSkipped').textContent=0;
  document.getElementById('importReportMessage').className='import-status ok';
  document.getElementById('importReportMessage').innerHTML=`<strong>Import terminé</strong><div class="tiny">${imported.length} dossier(s) traité(s).</div>`;
  setImportStep(4);
  setTimeout(()=>{goTo('importwatch');renderImportWatch();},150);
  return;
 }
 if(target==='opponents'){
  if(!unifiedSpecialPrepared||!opponentFffDirectoryDraft?.length)return toast('Import','Chargez un annuaire FFF valide.');
  opponentFffDirectoryDraft.forEach(directoryClubToOpponent);
  recordImport('opponents',{filename:unifiedSpecialFile?.name||'Annuaire clubs FFF',itemCount:opponentFffDirectoryDraft.length,source:'Annuaire clubs FFF PDF'});
  state.importHistory.unshift({id:uid('ih'),file:unifiedSpecialFile?.name||'Annuaire clubs FFF',target:'Annuaire clubs adverses',strategy:'mise à jour',date:new Date().toLocaleString('fr-FR'),read:opponentFffDirectoryDraft.length,added:opponentFffDirectoryDraft.length,updated:0,skipped:0});
  save(); renderImportHistory();
  document.getElementById('impRead').textContent=opponentFffDirectoryDraft.length;
  document.getElementById('impAdded').textContent=opponentFffDirectoryDraft.length;
  document.getElementById('impUpdated').textContent=0;
  document.getElementById('impSkipped').textContent=0;
  document.getElementById('importReportMessage').className='import-status ok';
  document.getElementById('importReportMessage').innerHTML=`<strong>Import terminé</strong><div class="tiny">${opponentFffDirectoryDraft.length} club(s) importé(s).</div>`;
  setImportStep(4);
  setTimeout(()=>{goTo('importwatch');renderImportWatch();},150);
  return;
 }
 runImport();
}


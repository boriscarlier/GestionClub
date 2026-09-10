function renderResetImportModeBanner(){
 const box=document.getElementById('resetImportModeBanner');
 if(!box)return;
 if(state.reimportMode?.active){
  const order=state.reimportMode.order||['members','matches','discipline','opponents'];
  const remaining=order.filter(t=>state.importRegistry?.[t]?.reimportRequired!==false && !state.importRegistry?.[t]?.importedAt);
  box.innerHTML=`<div class="reset-mode-banner">
   <strong>⚠️ Mode réimportation actif</strong>
   <div class="tiny">Bases restant à réimporter : ${remaining.map(t=>IMPORT_SOURCE_DEFS[t]?.label||t).join(' → ')||'Aucune'}.</div>
   <div class="tiny">Ordre conseillé : Licenciés → Matchs → Dossiers / Discipline → Annuaire clubs adverses.</div>
  </div>`;
 }else{
  box.innerHTML='';
 }
}

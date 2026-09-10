function renderMemberMutationInfo(m){
 const imported=document.getElementById('memberStampImportedBlock');
 const verified=document.getElementById('memberMutationVerified');
 const stateBox=document.getElementById('memberMutationState');
 if(!imported||!verified||!stateBox)return;

 const info=memberMutationInfo(m);
 if(!info.hasStamp&&!info.hasMutation){
  imported.innerHTML='';
  stateBox.innerHTML='';
  return;
 }

 imported.innerHTML=kvHtml([
  ['Cachet code',info.code],
  ['Cachet libellé',info.label],
  ['Cachet date de début',info.startDate?formatDisciplineDate(info.startDate):'—'],
  ['Cachet date de fin',info.endDate?formatDisciplineDate(info.endDate):'—']
 ]);

 verified.value=info.verified?'verified':'pending';

 // Les cas "aucun cachet" et "non muté" sont automatiquement considérés vérifiés.
 if(info.verifiedByDefault){
  verified.disabled=true;
 }else{
  verified.disabled=!currentAdminCan('members','edit');
 }

 if(info.explicitlyNotMutated){
  stateBox.innerHTML='<span class="badge green">VÉRIFIÉ — NON MUTÉ</span> <span>L’historique du licencié indique explicitement « non muté ».</span>';
 }else if(info.noStampData){
  stateBox.innerHTML='<span class="badge green">VÉRIFIÉ — AUCUN CACHET</span> <span>Aucun code, libellé, date de début ni date de fin n’est renseigné : aucune mutation n’est signalée.</span>';
 }else if(info.hasMutation && !info.startDate){
  stateBox.innerHTML='<span class="badge red">MUTATION — DATE À CONTRÔLER</span> <span>Le cachet indique une mutation mais aucune date de début n’est disponible.</span>';
 }else if(info.hasMutation && !info.verified){
  const period=[info.startDate?formatDisciplineDate(info.startDate):'—',info.endDate?formatDisciplineDate(info.endDate):'—'].join(' → ');
  stateBox.innerHTML=`<span class="badge yellow">MUTATION À VÉRIFIER</span> <span>Période importée : ${period}.</span>`;
 }else if(info.hasMutation){
  const period=[info.startDate?formatDisciplineDate(info.startDate):'—',info.endDate?formatDisciplineDate(info.endDate):'—'].join(' → ');
  stateBox.innerHTML=`<span class="badge green">MUTATION VÉRIFIÉE</span> <span>Période importée : ${period}${info.verifiedAt?' • vérifié le '+formatDisciplineDateTime(info.verifiedAt):''}.</span>`;
 }else{
  stateBox.innerHTML=`<span class="badge green">CACHET VÉRIFIÉ</span> <span>${escapeHtml(info.code||'—')} • ${escapeHtml(info.label||'—')}</span>`;
 }
}

function renderCoachFmiPreparation(matchId,match){
 const box=document.getElementById('coachFmiPreparationBox');if(!box)return;
 if(!matchId||!match){
  box.innerHTML='<div class="tiny">Sélectionnez un match pour préparer sa feuille de match.</div>';
  return;
 }

 if(coachMatchPlayed(match)){
  box.innerHTML=`
   <div><strong>Match terminé — régularisation interne</strong></div>
   <div class="tiny">La FMI n’est plus proposée pour ce match terminé. La composition reste accessible uniquement afin de compléter l’historique et les statistiques des joueurs.</div>`;
  return;
 }

 const record=coachFmiState()[matchId]||{};
 const deadline=coachFmiDeadlineState(match);
 const done=!!record.prepared;
 const badgeClass=done?'green':deadline.status==='due'?'red':deadline.status==='past'?'yellow':'blue';
 let timeText='';
 if(deadline.hours!==null && deadline.hours>=0){
  const h=Math.floor(deadline.hours);
  timeText=` • ${h} h avant le coup d’envoi`;
 }
 box.innerHTML=`
  <div><strong>Feuille de Match Informatisée — FFF</strong></div>
  <div class="tiny">Outil officiel de préparation de la composition. L’objectif J-2 / 48 h est un rappel interne CLUB EXEMPLE tant qu’aucun texte LRF spécifique n’est associé à cette échéance.</div>
  <div style="margin-top:7px"><span class="badge ${badgeClass}">${done?'PRÉPARATION FMI EFFECTUÉE':deadline.label}</span><span class="tiny coach-fmi-deadline">${timeText}</span></div>
  ${record.updatedAt?`<div class="tiny" style="margin-top:5px">Suivi local mis à jour : ${formatAccountDate(record.updatedAt)}</div>`:''}
  <div class="coach-fmi-actions">
   <button class="primary" onclick="openOfficialFmiPreparation()">↗ Préparer sur FMI — FFF</button>
   <button class="ghost" onclick="setCoachFmiPrepared('${matchId}',${done?'false':'true'})">${done?'↺ Marquer à refaire':'✓ Marquer préparation effectuée'}</button>
  </div>`;
}


function requestDeleteCurrentMatch(){
 if(!currentAdminCan('matches','delete'))return toast('Accès refusé','Suppression de match non autorisée.');
 const m=matchById(currentMatchId);if(!m)return;
 const box=document.getElementById('matchDeleteConfirm'),label=document.getElementById('matchDeleteConfirmLabel');
 if(label)label.textContent=`${formatMatchDateFr(m.date)} — ${matchTeamName(m)||'CLUB EXEMPLE'} / ${matchOpponentName(m)||'Adversaire'}`;
 if(box)box.classList.add('show');
}

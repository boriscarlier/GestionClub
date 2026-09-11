function confirmDeleteCurrentMatch(){
 if(!currentAdminCan('matches','delete'))return toast('Accès refusé','Suppression de match non autorisée.');
 const id=currentMatchId,m=matchById(id);if(!m)return;
 const label=`${m.date||''} — ${matchTeamName(m)||'CLUB EXEMPLE'} / ${matchOpponentName(m)||'adversaire'}`;
 state.matches=(state.matches||[]).filter(x=>x.id!==id);selectedMatchIds.delete(id);currentMatchId=null;save();
 if(typeof logAdminAction==='function')logAdminAction('Matchs','Suppression',label);
 cancelDeleteCurrentMatch();goTo('matches');renderMatchList();if(typeof renderDashboard==='function')renderDashboard();toast('Match','Match supprimé.');
}


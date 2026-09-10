function coachChangeTeam(){
 const m=coachMember();if(!m)return;
 const requested=document.getElementById('coachTeamSelect')?.value||null;
 const allowed=coachEligibleTeams(m);
 if(!requested||!allowed.includes(requested)){
  toast('Portail éducateurs','Équipe non autorisée.');
  coachCurrentTeamName=allowed[0]||null;
 }else coachCurrentTeamName=requested;

 if(coachCurrentTeamName)localStorage.setItem('fclc_coach_team',coachCurrentTeamName);
 const selectedTraining=coachTrainingSessionById(coachCurrentTrainingSessionId);
 if(selectedTraining&&norm(selectedTraining.team)!==norm(coachCurrentTeamName))coachCurrentTrainingSessionId=null;
 if(coachCurrentStatsPlayerId&&!coachTeamMembers().some(p=>p.id===coachCurrentStatsPlayerId))coachCurrentStatsPlayerId=null;

 // Conserver la rubrique en cours. Depuis le dashboard, ouvrir directement l'effectif
 // afin que le changement de catégorie affiche immédiatement les joueurs concernés.
 if(coachCurrentPage==='home')coachCurrentPage='roster';
 renderCoachPortal();
}

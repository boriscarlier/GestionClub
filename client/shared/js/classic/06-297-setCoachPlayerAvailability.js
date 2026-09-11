function setCoachPlayerAvailability(memberId,status){
 const player=coachTeamMembers().find(m=>m.id===memberId);
 if(!player){toast('Portail éducateurs','Joueur hors périmètre.');return;}
 const allowed=['available','injured','absent'];
 if(!allowed.includes(status)){toast('Portail éducateurs','Statut non reconnu.');return;}
 if(!state.coachPlayerAvailability)state.coachPlayerAvailability={};
  if(!state.coachFmiPreparation)state.coachFmiPreparation={};
  if(!state.coachTrainingSessions)state.coachTrainingSessions=[];
 state.coachPlayerAvailability[memberId]={
  status,
  team:coachCurrentTeamName,
  updatedAt:new Date().toISOString(),
  updatedBy:coachCurrentMemberId||''
 };
 localStorage.setItem(KEY,JSON.stringify(state));
 if(typeof logAdminAction==='function')logAdminAction('Portail éducateurs','Statut joueur',`${coachCurrentTeamName} • ${player.last||''} ${player.first||''} → ${status}`);
 renderCoachPortal();
 toast('Effectif',status==='available'?'Joueur disponible.':status==='injured'?'Joueur marqué blessé.':'Joueur marqué absent.');
}

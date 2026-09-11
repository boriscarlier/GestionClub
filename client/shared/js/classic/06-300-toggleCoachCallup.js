function toggleCoachCallup(matchId,memberId,checked){
 const allowedMatch=coachTeamMatches().some(m=>m.id===matchId);
 const player=coachTeamMembers().find(m=>m.id===memberId);
 if(!allowedMatch||!player){toast('Portail éducateurs','Action hors périmètre refusée.');return;}
 const st=coachPlayerStatus(player);
 if(checked&&!coachPlayerCanBeSelected(player)){toast('Convocation',`Ce joueur ne peut pas être convoqué (${st.label}).`);return;}
 if(!state.coachCallups)state.coachCallups={};
  if(!state.coachPlayerAvailability)state.coachPlayerAvailability={};
 if(!state.coachCallups[matchId])state.coachCallups[matchId]=[];
 if(checked&&!state.coachCallups[matchId].includes(memberId))state.coachCallups[matchId].push(memberId);
 if(!checked)state.coachCallups[matchId]=state.coachCallups[matchId].filter(x=>x!==memberId);
 localStorage.setItem(KEY,JSON.stringify(state));
 if(typeof logAdminAction==='function')logAdminAction('Portail éducateurs','Convocation',`${coachCurrentTeamName} • ${matchId}`);
 renderCoachCallup();
}

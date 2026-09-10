function initCoachPortal(){
 try{
  coachLineups=JSON.parse(localStorage.getItem('fclc_coach_lineups')||'{}');
  Object.keys(coachLineups||{}).forEach(matchId=>coachLineupRecord(matchId));
  saveCoachLineups();
 }catch(e){coachLineups={}}
 const id=localStorage.getItem('fclc_coach_member'),team=localStorage.getItem('fclc_coach_team');
 if(id&&(state.members||[]).some(m=>m.id===id)){coachCurrentMemberId=id;coachCurrentTeamName=team||null;renderCoachPortal();}
}



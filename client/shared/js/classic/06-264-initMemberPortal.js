function initMemberPortal(){
 const saved=localStorage.getItem('fclc_portal_member');
 if(saved&&(state.members||[]).some(m=>m.id===saved)){portalCurrentMemberId=saved;renderMemberPortal();}
}


let coachCurrentMemberId=null;
let coachCurrentTeamName=null;
let coachLineups={};
let coachCurrentPage='home';
let coachCurrentTrainingSessionId=null;
let coachCurrentStatsPlayerId=null;


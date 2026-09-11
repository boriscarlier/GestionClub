function coachChangeTeamFromMobile(){
 const mobile=document.getElementById('coachMobileTeamSelect');
 const desktop=document.getElementById('coachTeamSelect');
 if(!mobile||!desktop)return;
 desktop.value=mobile.value;
 coachChangeTeam();
}

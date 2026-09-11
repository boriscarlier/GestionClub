function coachLogout(){
 coachCurrentMemberId=null;coachCurrentTeamName=null;coachCurrentPage='home';
 localStorage.removeItem('gestionclub_coach_member');localStorage.removeItem('gestionclub_coach_team');
 toggleCoachMobileMore(false);
 document.body.classList.remove('coach-mobile-sheet-open');
 const a=document.getElementById('coachApp'),l=document.getElementById('coachLogin');
 if(a)a.style.display='none';if(l)l.style.display='block';
}

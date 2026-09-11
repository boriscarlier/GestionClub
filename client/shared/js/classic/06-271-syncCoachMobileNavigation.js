function syncCoachMobileNavigation(){
 const title=document.getElementById('coachMobilePageTitle');
 if(title)title.textContent=coachMobilePageTitle(coachCurrentPage);
 document.querySelectorAll('[data-coach-mobile-page]').forEach(btn=>{
  const page=btn.dataset.coachMobilePage;
  const secondary=['callups','lineup','contacts'].includes(coachCurrentPage);
  btn.classList.toggle('active',page===coachCurrentPage||(page==='more'&&secondary));
 });
}

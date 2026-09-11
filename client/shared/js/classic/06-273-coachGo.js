function coachGo(name){
 const allowed=['home','roster','matches','callups','lineup','training','contacts'];
 const target=allowed.includes(name)?name:'home';
 const changed=coachCurrentPage!==target;
 coachCurrentPage=target;
 document.querySelectorAll('.coach-page').forEach(p=>p.classList.toggle('active',p.id==='coach-'+coachCurrentPage));
 syncCoachMobileNavigation();
 toggleCoachMobileMore(false);
 if(changed&&window.innerWidth<=768){
  requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}));
 }
}

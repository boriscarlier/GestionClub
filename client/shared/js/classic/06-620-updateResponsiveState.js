function updateResponsiveState(){
 const w=window.innerWidth||document.documentElement.clientWidth||1024;
 document.body.classList.toggle('is-mobile',w<=768);
 document.body.classList.toggle('is-tablet',w>768&&w<=1024);
 document.body.classList.toggle('is-laptop',w>1024&&w<=1200);
 document.body.classList.toggle('is-desktop',w>1200);
}
window.addEventListener('resize',updateResponsiveState,{passive:true});
document.addEventListener('DOMContentLoaded',updateResponsiveState);
updateResponsiveState();


window.addEventListener('resize',()=>{
 if(window.innerWidth>1024 && typeof closeAdminMobileSidebar==='function')closeAdminMobileSidebar();
 if(window.innerWidth>1024){
  const mm=document.getElementById('mobileMenu');
  if(mm)mm.classList.remove('open');
 }
},{passive:true});


// ===== V1.21.20 — STABILISATION TECHNIQUE GLOBALE =====
const GESTION_CLUB_BUILD=QA_BUILD;

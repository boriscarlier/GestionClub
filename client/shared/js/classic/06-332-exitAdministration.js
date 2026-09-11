function exitAdministration(){
 const admin=document.getElementById('intranetApp');
 const pub=document.getElementById('publicApp');
 const login=document.getElementById('adminLoginScreen');

 closeAdministrationTransientUI('public');

 if(login){
  login.classList.add('hidden');
  login.style.display='none';
 }
 if(admin){
  admin.classList.add('hidden');
  admin.style.display='none';
  admin.style.visibility='';
  admin.style.pointerEvents='';
 }
 if(pub){
  pub.classList.remove('hidden');
  pub.style.removeProperty('display');
  pub.style.removeProperty('visibility');
  pub.style.removeProperty('pointer-events');
 }
 ['coachApp','coachLogin','portalApp','portalLogin'].forEach(id=>{
  const el=document.getElementById(id);
  if(el){
   el.style.removeProperty('visibility');
   el.style.removeProperty('pointer-events');
  }
 });

 if(typeof showPublicPage==='function')showPublicPage('public-home');
 window.scrollTo({top:0,behavior:'smooth'});
}


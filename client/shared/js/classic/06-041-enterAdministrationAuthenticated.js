function enterAdministrationAuthenticated(){
 const a=currentAdminAccount();
 if(!a)return showAdminLogin();

 hidePublicAndPortalLayersForAdministration();

 const admin=document.getElementById('intranetApp');
 const login=document.getElementById('adminLoginScreen');

 if(login){
  login.classList.add('hidden');
  login.style.display='none';
 }

 if(!admin){
  console.error('Conteneur Administration introuvable');
  if(typeof toast==='function')toast('Administration','Conteneur Administration introuvable.');
  return;
 }

 admin.classList.remove('hidden');
 admin.style.removeProperty('display');
 admin.style.visibility='visible';
 admin.style.pointerEvents='auto';

 const prof=document.querySelector('#intranetApp .profile span');
 if(prof)prof.textContent=accountFullName(a);

 applyAdminPermissions();

 // Réinitialiser complètement l'état visuel de l'Administration avant le dashboard.
 document.querySelectorAll('#intranetApp .page').forEach(p=>p.classList.remove('active'));
 document.querySelectorAll('#intranetApp .nav button[data-page]').forEach(b=>b.classList.remove('active'));
 document.querySelectorAll('#intranetApp .nav-group').forEach(g=>g.classList.remove('has-active'));

 goTo('dashboard');
 window.scrollTo({top:0,behavior:'auto'});
}

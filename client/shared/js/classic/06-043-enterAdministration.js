function enterAdministration(){
 if((state.accounts||[]).length){
  if(!currentAdminAccount()){showAdminLogin();return;}
  return enterAdministrationAuthenticated();
 }

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

 document.querySelectorAll('#intranetApp .page').forEach(p=>p.classList.remove('active'));
 document.querySelectorAll('#intranetApp .nav button[data-page]').forEach(b=>b.classList.remove('active'));
 document.querySelectorAll('#intranetApp .nav-group').forEach(g=>g.classList.remove('has-active'));

 const dashboard=document.getElementById('dashboard');
 if(dashboard)dashboard.classList.add('active');

 const dashNav=document.querySelector('#intranetApp .nav button[data-page="dashboard"]');
 if(dashNav)dashNav.classList.add('active');

 const title=document.getElementById('pageTitle');
 if(title)title.textContent='Tableau de bord';

 if(typeof renderDashboard==='function'){
  try{renderDashboard()}catch(err){console.error('Erreur rendu Dashboard',err)}
 }
 if(typeof renderAll==='function'){
  try{renderAll()}catch(err){
   console.error('Erreur renderAll Administration',err);
   if(typeof toast==='function')toast('Administration','Erreur de rendu : '+(err.message||err));
  }
 }

 window.scrollTo({top:0,behavior:'auto'});
}


const PAGE_PERMISSION_MODULE={
 dashboard:'dashboard',statistics:'statistics','statistics-members':'statistics','statistics-members-advanced':'statistics','statistics-teams':'statistics','statistics-results':'statistics','statistics-discipline':'statistics','statistics-opponents':'statistics','statistics-data':'statistics',
 members:'members',memberdetail:'members',teams:'teams',teamdetailadmin:'teams',matches:'matches',matchdetail:'matches',discipline:'discipline',
 cms:'communication',communication:'communication',media:'media',visual:'visual',
 import:'imports',importwatch:'imports',fffcontrol:'imports',documents:'documents',documentcenter:'documents',admincheck:'documents',regcheck:'documents',alerts:'documents',
 accounts:'accounts',accountdetail:'accounts',permissions:'accounts',auditlog:'accounts',accessadmin:'accounts',accessaudit:'accounts',automation:'settings',settings:'settings',clubsettings:'clubsettings',opponents:'matches',opponentdetail:'matches',planning:'matches'
};

function attemptAdminLogin(){
 const accountId=document.getElementById('adminPrototypeAccount')?.value||'';
 const status=document.getElementById('adminLoginStatus');
 const a=(state.accounts||[]).find(x=>x.id===accountId);

 if(!a||a.status==='disabled'){
  if(status)status.textContent='Sélectionne un compte actif.';
  return;
 }

 a.lastLoginAt=new Date().toISOString();
 sessionStorage.setItem('gestionclub_admin_account',a.id);
 localStorage.setItem(KEY,JSON.stringify(state));

 const login=document.getElementById('adminLoginScreen');
 if(login){login.classList.add('hidden');login.style.display='none'}

 if(typeof logAdminAction==='function')logAdminAction('Authentification','Connexion prototype',a.email||accountFullName(a));
 enterAdministrationAuthenticated();
}


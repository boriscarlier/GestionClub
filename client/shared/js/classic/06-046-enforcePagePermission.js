function enforcePagePermission(page){
 const a=currentAdminAccount();
 const mod=PAGE_PERMISSION_MODULE[page]||page;
 if(!accountCan(a,mod,'view')){
  if(typeof toast==='function')toast('Accès refusé','Vous n’avez pas l’autorisation d’accéder à ce module.');
  return false;
 }
 return true;
}


function logoutAdministration(){
 sessionStorage.removeItem('gestionclub_admin_account');
 if((state.accounts||[]).length)showAdminLogin();
 else exitAdministration();
}


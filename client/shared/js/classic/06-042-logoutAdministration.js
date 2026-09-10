function logoutAdministration(){
 sessionStorage.removeItem('fclc_admin_account');
 if((state.accounts||[]).length)showAdminLogin();
 else exitAdministration();
}


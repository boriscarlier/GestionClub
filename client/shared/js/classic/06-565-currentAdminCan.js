function currentAdminCan(module,action='view'){
 const account=typeof currentAdminAccount==='function'?currentAdminAccount():null;
 if(!(state.accounts||[]).length)return true; // mode prototype local sans comptes
 return typeof accountCan==='function'?accountCan(account,module,action):false;
}

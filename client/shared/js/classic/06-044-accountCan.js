function accountCan(account,module,action='view'){
 if(!account)return (state.accounts||[]).length===0;
 if(account.status==='disabled')return false;
 return (account.roles||[]).some(r=>roleHasPermission(r,module,action));
}

function accountEffectivePermission(account,module,action='view'){
 if(!account||account.status==='disabled')return false;
 return (account.roles||[]).some(roleId=>roleHasPermission(roleId,module,action));
}

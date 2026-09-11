function roleHasPermission(roleId,module,action='view'){
 const p=state.permissionMatrix?.[roleId];
 if(p==='*')return true;
 return Array.isArray(p?.[module])&&p[module].includes(action);
}

function accountRoleNames(a){
 return (a?.roles||[]).map(id=>roleById(id)?.name||id);
}



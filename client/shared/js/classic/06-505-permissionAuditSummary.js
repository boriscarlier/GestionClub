function permissionAuditSummary(){
 const roles=state.roles||[];
 const accounts=state.accounts||[];
 const active=accounts.filter(a=>a.status!=='disabled');
 const noRole=active.filter(a=>!(a.roles||[]).length).length;
 const noScope=active.filter(a=>!a.scope?.type).length;
 const unrestricted=roles.filter(r=>state.permissionMatrix?.[r.id]==='*').length;
 const custom=roles.length-unrestricted;
 return {roles:roles.length,custom,unrestricted,noRole,noScope};
}

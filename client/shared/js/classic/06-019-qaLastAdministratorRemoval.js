function qaLastAdministratorRemoval(id,nextStatus,nextRoles){
 const target=accountById(id);if(!target||target.status==='disabled'||!(target.roles||[]).some(r=>['admin','president'].includes(r)))return false;
 if(nextStatus!=='disabled'&&(nextRoles||[]).some(r=>['admin','president'].includes(r)))return false;
 return !(state.accounts||[]).some(a=>a.id!==id&&a.status!=='disabled'&&(a.roles||[]).some(r=>['admin','president'].includes(r)));
}


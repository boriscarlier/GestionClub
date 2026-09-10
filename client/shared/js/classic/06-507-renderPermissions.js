function renderPermissions(){
 renderPermissionSummary();
 const body=document.getElementById('permissionRows');if(!body)return;
 const roles=state.roles||[];
 body.innerHTML=roles.flatMap(r=>PERMISSION_MODULES.map(m=>{
  const locked=state.permissionMatrix?.[r.id]==='*';
  return `<tr>
   <td><strong>${escapeHtml(r.name)}</strong>${locked?'<div class="permission-role-note">Accès complet système</div>':''}</td>
   <td>${escapeHtml(PERMISSION_MODULE_LABELS[m]||m)}</td>
   ${PERMISSION_ACTIONS.map(a=>`<td><label title="${escapeHtml(PERMISSION_ACTION_LABELS[a]||a)}"><input type="checkbox" ${roleHasPermission(r.id,m,a)?'checked':''} ${locked?'disabled':''} onchange="setRolePermission('${r.id}','${m}','${a}',this.checked);renderPermissionSummary()"></label></td>`).join('')}
  </tr>`;
 })).join('');
}




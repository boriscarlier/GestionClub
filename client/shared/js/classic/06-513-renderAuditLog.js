function renderAuditLog(){
 renderAuditSummary();
 const body=document.getElementById('auditRows');if(!body)return;

 const q=norm(document.getElementById('auditQuery')?.value||'');
 const moduleFilter=document.getElementById('auditModuleFilter');
 const userFilter=document.getElementById('auditUserFilter');
 const period=Number(document.getElementById('auditPeriodFilter')?.value||0);

 const modules=[...new Set((state.auditLog||[]).map(x=>x.module).filter(Boolean))].sort();
 if(moduleFilter){
  const current=moduleFilter.value;
  moduleFilter.innerHTML='<option value="">Tous modules</option>'+modules.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join('');
  if(modules.includes(current))moduleFilter.value=current;
 }
 const users=[...new Set((state.auditLog||[]).map(x=>x.user).filter(Boolean))].sort();
 if(userFilter){
  const current=userFilter.value;
  userFilter.innerHTML='<option value="">Tous utilisateurs</option>'+users.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join('');
  if(users.includes(current))userFilter.value=current;
 }

 const mod=moduleFilter?.value||'';
 const usr=userFilter?.value||'';
 const cutoff=period?Date.now()-period*86400000:null;

 const rows=(state.auditLog||[]).filter(x=>{
  if(mod&&x.module!==mod)return false;
  if(usr&&x.user!==usr)return false;
  if(cutoff&&new Date(x.at).getTime()<cutoff)return false;
  if(q&&!norm([x.user,x.module,x.action,x.detail].join(' ')).includes(q))return false;
  return true;
 });

 body.innerHTML=rows.slice(0,300).map(x=>`<tr>
  <td>${formatAccountDate(x.at)}</td>
  <td>${escapeHtml(x.user)}</td>
  <td>${escapeHtml(x.module)}</td>
  <td>${escapeHtml(x.action)}</td>
  <td>${escapeHtml(x.detail||'')}</td>
 </tr>`).join('')||'<tr><td colspan="5" class="tiny">Aucune action correspondant aux filtres.</td></tr>';
}



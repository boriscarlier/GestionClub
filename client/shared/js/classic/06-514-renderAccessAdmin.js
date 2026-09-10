function renderAccessAdmin(){
 const rows=state.accounts||[];const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('aaActive',rows.filter(a=>a.status!=='disabled').length);
 set('aaDisabled',rows.filter(a=>a.status==='disabled').length);
 set('aaNoRole',rows.filter(a=>!(a.roles||[]).length).length);
 set('aaNoScope',rows.filter(a=>!a.scope?.type).length);
 const body=document.getElementById('aaRows');if(!body)return;
 body.innerHTML=rows.map(a=>`<tr><td><strong>${escapeHtml(accountFullName(a))}</strong><div class="tiny">${escapeHtml(a.email||'')}</div></td><td>${accountStatusBadge(a)}</td><td>${escapeHtml(accountRoleNames(a).join(', ')||'Aucun')}</td><td>${escapeHtml(accountScopeLabel(a))}</td><td>${formatAccountDate(a.lastLoginAt)}</td><td><button class="ghost" onclick="openAccountDetail('${a.id}')">Ouvrir</button></td></tr>`).join('')||'<tr><td colspan="6" class="tiny">Aucun compte.</td></tr>';
}



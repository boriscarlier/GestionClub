function renderAccounts(){
 const grid=document.getElementById('accountsGrid');if(!grid)return;
 refreshAccountFunctionFilter();
 const q=norm(document.getElementById('accountSearch')?.value||'');
 const status=document.getElementById('accountStatusFilter')?.value||'';
 const fn=document.getElementById('accountFunctionFilter')?.value||'';

 const rows=(state.accounts||[]).filter(a=>{
  if(status&&a.status!==status)return false;
  if(fn&&String(a.function||'')!==fn)return false;
  if(q&&!norm([a.first,a.last,a.email,a.function,accountRoleNames(a).join(' '),accountScopeLabel(a)].join(' ')).includes(q))return false;
  return true;
 }).sort((a,b)=>accountFullName(a).localeCompare(accountFullName(b),'fr'));

 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 const all=state.accounts||[];
 set('accountCountTotal',all.length);
 set('accountCountActive',all.filter(a=>a.status!=='disabled').length);
 set('accountCountDisabled',all.filter(a=>a.status==='disabled').length);
 set('accountCountLinked',all.filter(a=>!!a.memberId).length);

 grid.innerHTML=rows.length?rows.map(a=>{
  const linked=accountLinkedMember(a);
  const issues=[];
  if(a.status!=='disabled'&&!(a.roles||[]).length)issues.push('aucun rôle');
  if(a.status!=='disabled'&&!a.scope?.type)issues.push('périmètre absent');
  return `<div class="account-card ${a.status==='disabled'?'disabled':''}" data-account-id="${a.id}">
   <div class="account-card-head">
    <div><strong>${escapeHtml(accountFullName(a))}</strong><div class="tiny">${escapeHtml(a.email||'Email non renseigné')}</div></div>
    ${accountStatusBadge(a)}
   </div>
   <div class="account-meta tiny">
    <div><strong>Fonction :</strong> ${escapeHtml(a.function||'Non renseignée')}</div>
    <div><strong>Rôles :</strong> ${escapeHtml(accountRoleNames(a).join(', ')||'Aucun')}</div>
    <div><strong>Périmètre :</strong> ${escapeHtml(accountScopeLabel(a))}</div>
    <div><strong>Licencié :</strong> ${linked?escapeHtml(linked.fullName||`${linked.last||''} ${linked.first||''}`.trim()):'Non rattaché'}</div>
    <div><strong>Dernière connexion :</strong> ${formatAccountDate(a.lastLoginAt)}</div>
   </div>
   ${issues.length?`<div class="account-warning tiny">⚠️ Compte à contrôler : ${escapeHtml(issues.join(', '))}.</div>`:''}
   <div class="account-card-actions">
    <button class="ghost" onclick="event.stopPropagation();openAccountDetail('${a.id}')">Ouvrir</button>
    <button class="ghost" onclick="event.stopPropagation();openAccountEditor('${a.id}')">Modifier</button>
    <button class="${a.status==='disabled'?'secondary':'danger'}" onclick="event.stopPropagation();toggleAccountStatus('${a.id}')">${a.status==='disabled'?'Réactiver':'Désactiver'}</button>
   </div>
  </div>`;
 }).join(''):'<div class="stats-empty">Aucun compte correspondant.</div>';

 grid.querySelectorAll('[data-account-id]').forEach(card=>{
  card.addEventListener('click',()=>openAccountDetail(card.dataset.accountId));
 });
}

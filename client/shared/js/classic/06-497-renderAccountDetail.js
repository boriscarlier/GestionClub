function renderAccountDetail(){
 const a=accountById(currentAccountId);
 const body=document.getElementById('accountDetailBody');if(!body)return;
 if(!a){
  body.innerHTML='<div class="card">Compte introuvable.</div>';return;
 }
 const linked=accountLinkedMember(a);
 const title=document.getElementById('accountDetailTitle');if(title)title.textContent=accountFullName(a);
 const sub=document.getElementById('accountDetailSubtitle');if(sub)sub.textContent=a.email||'Compte utilisateur';
 body.innerHTML=`
  <div class="grid cols-2">
   <div class="card">
    <h3 style="margin-top:0">Identité du compte</h3>
    <div class="stats-health">
     <div class="stats-health-row"><span>Nom</span><strong>${escapeHtml(accountFullName(a))}</strong></div>
     <div class="stats-health-row"><span>Email</span><strong>${escapeHtml(a.email||'—')}</strong></div>
     <div class="stats-health-row"><span>Fonction</span><strong>${escapeHtml(a.function||'—')}</strong></div><div class="stats-health-row"><span>Rôles</span><strong>${escapeHtml(accountRoleNames(a).join(', ')||'—')}</strong></div><div class="stats-health-row"><span>Périmètre</span><strong>${escapeHtml(accountScopeLabel(a))}</strong></div>
     <div class="stats-health-row"><span>Statut</span><span>${accountStatusBadge(a)}</span></div>
    </div>
   </div>
   <div class="card">
    <h3 style="margin-top:0">Accès</h3>
    <div class="stats-health">
     <div class="stats-health-row"><span>Créé le</span><strong>${formatAccountDate(a.createdAt)}</strong></div>
     <div class="stats-health-row"><span>Modifié le</span><strong>${formatAccountDate(a.updatedAt)}</strong></div>
     <div class="stats-health-row"><span>Dernière connexion</span><strong>${formatAccountDate(a.lastLoginAt)}</strong></div>
    </div>
   </div>
  </div>
  <div class="card" style="margin-top:14px">
   <h3 style="margin-top:0">Rattachement licencié</h3>
   <div class="account-link-member">${linked
    ? `<strong>${escapeHtml(linked.fullName||`${linked.last||''} ${linked.first||''}`.trim())}</strong><div class="tiny">${escapeHtml(linked.licenseNumber||'Licence non renseignée')} • ${escapeHtml(linked.category||'Catégorie non renseignée')}</div><div style="margin-top:8px"><button class="ghost" onclick="openMemberDetail('${linked.id}')">Ouvrir la fiche licencié</button></div>`
    : '<div class="tiny">Ce compte n’est rattaché à aucun licencié.</div>'}</div>
   ${a.status!=='disabled'&&(!(a.roles||[]).length||!a.scope?.type)?'<div class="account-warning tiny">⚠️ Ce compte actif nécessite une vérification de ses rôles ou de son périmètre.</div>':''}
  </div>
  <div class="card" style="margin-top:14px">
   <h3 style="margin-top:0">Note interne</h3>
   <div class="tiny">${escapeHtml(a.note||'Aucune note.')}</div>
   <div class="account-actions">
    <button class="primary" onclick="openAccountEditor('${a.id}')">Modifier</button>
    <button class="${a.status==='disabled'?'secondary':'danger'}" onclick="toggleAccountStatus('${a.id}')">${a.status==='disabled'?'Réactiver':'Désactiver'}</button>
    <button class="ghost" onclick="simulateAccountLogin('${a.id}')">Simuler une connexion</button>
   </div>
  </div>`;
}

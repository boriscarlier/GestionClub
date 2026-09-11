function renderPermissionSummary(){
 const root=document.getElementById('permissionSummaryGrid');
 if(!root)return;
 const s=permissionAuditSummary();
 root.innerHTML=`
  <div class="permission-summary-card"><span class="tiny">Rôles</span><strong>${s.roles}</strong></div>
  <div class="permission-summary-card"><span class="tiny">Rôles personnalisés</span><strong>${s.custom}</strong></div>
  <div class="permission-summary-card"><span class="tiny">Accès complets</span><strong>${s.unrestricted}</strong></div>
  <div class="permission-summary-card"><span class="tiny">Comptes actifs à contrôler</span><strong>${s.noRole+s.noScope}</strong><div class="tiny">${s.noRole} sans rôle • ${s.noScope} sans périmètre</div></div>`;
}


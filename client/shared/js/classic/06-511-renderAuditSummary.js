function renderAuditSummary(){
 const root=document.getElementById('auditSummaryGrid');
 if(!root)return;
 const s=auditSummary();
 root.innerHTML=`
  <div class="audit-summary-card"><span class="tiny">Actions journalisées</span><strong>${s.total}</strong></div>
  <div class="audit-summary-card"><span class="tiny">7 derniers jours</span><strong>${s.last7}</strong></div>
  <div class="audit-summary-card"><span class="tiny">Utilisateurs</span><strong>${s.users}</strong></div>
  <div class="audit-summary-card"><span class="tiny">Modules</span><strong>${s.modules}</strong></div>`;
}


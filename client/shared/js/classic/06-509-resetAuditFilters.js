function resetAuditFilters(){
 ['auditQuery','auditModuleFilter','auditUserFilter','auditPeriodFilter'].forEach(id=>{
  const el=document.getElementById(id);if(el)el.value='';
 });
 renderAuditLog();
}

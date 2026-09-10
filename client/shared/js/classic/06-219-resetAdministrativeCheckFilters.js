function resetAdministrativeCheckFilters(){
 ['checkQuery','checkSeverity','checkKind'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
 renderAdministrativeChecks();
}

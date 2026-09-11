function resetRegulatoryCheckFilters(){
 ['regQuery','regSeverity','regKind','regReviewStatus'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
 renderRegulatoryChecks();
}

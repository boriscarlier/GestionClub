function resetPlanningFilters(){
 ['planningSearch','planningTeamFilter','planningTypeFilter'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
 renderPlanning();
}


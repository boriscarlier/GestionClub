function resetDisciplineFilters(){
 ['disciplineQuery','disciplineStatusFilter','disciplineAlertFilter'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
 renderDiscipline();
}

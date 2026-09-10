function resetMemberFilters(){
 ['memberSearch','memberCategoryFilter','memberTypeFilter','memberLicenseFilter','memberDisciplineFilter'].forEach(id=>{
  const el=document.getElementById(id);
  if(el)el.value='';
 });
 clearMemberSelection();
 renderMembers();
}


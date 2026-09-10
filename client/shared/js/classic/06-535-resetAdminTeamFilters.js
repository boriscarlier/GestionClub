function resetAdminTeamFilters(){
 const q=document.getElementById('adminTeamSearch');if(q)q.value='';
 const g=document.getElementById('adminTeamGroupFilter');if(g)g.value='';
 renderAdminTeams();
}

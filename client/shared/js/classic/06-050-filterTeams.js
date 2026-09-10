function filterTeams(filter,btn){
  activeTeamFilter=filter;
  document.querySelectorAll('#teamFilters button').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderOpponentClubs();
 renderImportWatch();
 renderPlanning();
 renderCms();
 renderPublic();
}

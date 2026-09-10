function adminTeamById(id){
 return (state.teams||[]).find(t=>t.id===id)||null;
}

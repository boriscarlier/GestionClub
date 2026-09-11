function publicVisibleMembersForTeam(team){
 if(!team?.rosterPublic)return [];
 return (state.members||[]).filter(m=>
  m.public===true &&
  norm(m.category||m.team||'')===norm(team.name||'') &&
  norm(m.type||'joueur').includes('joueur')
 );
}

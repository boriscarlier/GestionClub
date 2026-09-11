function coachTeamMembers(){
 const team=coachCurrentTeamName;
 if(!team||!qaCoachScope(team))return [];
 return (state.members||[]).filter(m=>{
  const role=norm(m.type||m.licenseType);
  if(['dirigeant','arbitre','educateur','technique','volontaire'].some(r=>role.includes(r)))return false;
  const memberTeams=[m.category,m.subcategory,m.team,m.teamName].filter(Boolean).map(norm);
  return memberTeams.includes(norm(team));
 });
}


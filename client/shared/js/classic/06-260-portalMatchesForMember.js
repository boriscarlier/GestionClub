function portalMatchesForMember(m){
 const teams=new Set(portalMemberTeams(m).map(t=>t.name));
 if(m.category)teams.add(m.category);
 return (state.matches||[]).filter(mt=>teams.has(mt.team)).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
}

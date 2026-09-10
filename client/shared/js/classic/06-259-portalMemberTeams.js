function portalMemberTeams(m){
 const cats=new Set(portalSiblingLicenses(m).map(x=>x.category).filter(Boolean));
 return (state.teams||[]).filter(t=>cats.has(t.name)||cats.has(t.category));
}

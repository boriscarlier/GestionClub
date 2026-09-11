function portalMessages(m){
 const teamNames=new Set(portalMemberTeams(m).map(t=>t.name));
 return (state.posts||[]).filter(p=>['Publié','Publiée'].includes(p.status)).filter(p=>!p.team||teamNames.has(p.team));
}

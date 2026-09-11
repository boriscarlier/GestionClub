function coachEligibleTeams(member){
 if(!member)return [];
 const linked=(state.accounts||[]).filter(a=>a.memberId===member.id);
 if(linked.length){
  const a=linked.find(x=>x.status==='active');if(!a)return [];
  if(!(a.roles||[]).some(r=>['coach','sport','admin','president','manager'].includes(r)))return [];
  const scope=a.scope||{};
  if(['team','category'].includes(scope.type)){
   const requested=(scope.teams||[]).map(String);
   const base=(state.teams||[]).filter(t=>requested.some(v=>v===t.id||norm(v)===norm(t.name))).map(t=>t.name);
   return expandCoachTeamScopeOneLevel(base);
  }
  if(['club','sport'].includes(scope.type))return (state.teams||[]).map(t=>t.name);
  return [];
 }
 const names=(state.teams||[]).filter(t=>[t.coach,t.assistant,t.manager].some(v=>[norm(`${member.first||''} ${member.last||''}`),norm(`${member.last||''} ${member.first||''}`)].filter(Boolean).includes(norm(v)))).map(t=>t.name);
 if(!names.length&&/educateur|technique/.test(norm(member.type||member.licenseType)))
  (state.teams||[]).filter(t=>norm(t.name)===norm(member.category)).forEach(t=>names.push(t.name));
 return expandCoachTeamScopeOneLevel(names);
}

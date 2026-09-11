function expandCoachTeamScopeOneLevel(teamNames){
 const out=new Set();
 (teamNames||[]).forEach(name=>{
  if(!name)return;
  out.add(name);
  const lower=immediatelyLowerYouthTeamName(name);
  if(lower)out.add(lower);
 });
 return [...out];
}

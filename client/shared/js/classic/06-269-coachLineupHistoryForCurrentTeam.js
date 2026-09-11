function coachLineupHistoryForCurrentTeam(){
 return Object.entries(coachLineups||{}).map(([matchId,raw])=>{
  const rec=Array.isArray(raw)?{players:raw,updatedAt:'',team:''}:raw;
  const match=(state.matches||[]).find(m=>m.id===matchId)||null;
  return {matchId,rec,match};
 }).filter(x=>{
  const team=x.rec?.team||x.match?.team||'';
  return qaCoachScope()&&norm(team)===norm(coachCurrentTeamName);
 }).sort((a,b)=>String(b.match?.date||'').localeCompare(String(a.match?.date||'')));
}



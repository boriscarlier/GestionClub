function coachPlayerMatchHistory(memberId){
 const rows=[];
 Object.entries(coachLineups||{}).forEach(([matchId,raw])=>{
  const rec=Array.isArray(raw)?{players:raw}:raw;
  if(!rec||!Array.isArray(rec.players)||!rec.players.includes(memberId))return;
  const match=(state.matches||[]).find(m=>m.id===matchId);
  if(!match)return;
  rows.push({
   id:matchId,date:match.date||'',opponent:match.opponent||'—',
   team:match.team||rec.team||'',status:match.status||'',
   played:coachMatchPlayed(match)&&coachLineupExistsForMatch(matchId),place:match.place||''
  });
 });
 return rows.sort((a,b)=>String(b.date).localeCompare(String(a.date)));
}

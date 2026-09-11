function opponentStatsRows(){
 const map=new Map();
 (state.matches||[]).forEach(m=>{
  const name=String(m.opponentClub||m.opponent||'').trim();if(!name)return;
  const key=norm(name);if(!map.has(key))map.set(key,{name,matches:0,w:0,d:0,l:0,gf:0,ga:0,calc:0});
  const s=map.get(key);s.matches++;const pair=statisticsScorePair(m);if(!pair)return;s.calc++;s.gf+=pair.fc;s.ga+=pair.opp;if(pair.fc>pair.opp)s.w++;else if(pair.fc<pair.opp)s.l++;else s.d++;
 });
 return [...map.values()].sort((a,b)=>b.matches-a.matches||a.name.localeCompare(b.name,'fr'));
}

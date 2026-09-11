function renderStatisticsResults(){
 const teamNames=[...new Set((state.matches||[]).map(m=>m.team).filter(Boolean))];
 const rows=teamNames.map(team=>teamMatchStats(team)).sort((a,b)=>(b.w-b.l)-(a.w-a.l));
 const body=document.getElementById('srTeamRows');if(body)body.innerHTML=rows.map(s=>`<tr><td><strong>${escapeHtml(s.team)}</strong></td><td>${s.played}</td><td>${s.w}</td><td>${s.d}</td><td>${s.l}</td><td>${s.gf}</td><td>${s.ga}</td><td>${s.gf-s.ga>0?'+':''}${s.gf-s.ga}</td><td>${s.played-s.unknown?Math.round(s.w/Math.max(1,s.played-s.unknown)*100):0}%</td></tr>`).join('');
 let best=null,worst=null,prolific=null;const months={};
 (state.matches||[]).forEach(m=>{
  const pair=statisticsScorePair(m);if(!pair)return;
  const diff=pair.fc-pair.opp,total=pair.fc+pair.opp;
  if(diff>0&&(!best||diff>best.diff))best={m,pair,diff};
  if(diff<0&&(!worst||diff<worst.diff))worst={m,pair,diff};
  if(!prolific||total>prolific.total)prolific={m,pair,total};
  const month=String(m.date||'').slice(0,7)||'Date inconnue';months[month]=(months[month]||0)+1;
 });
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('srBestWin',best?`${best.pair.fc}-${best.pair.opp}`:'—');set('srBestWinMeta',best?`${best.m.team} • ${best.m.opponent||''}`:'Aucune victoire calculable');
 set('srWorstLoss',worst?`${worst.pair.fc}-${worst.pair.opp}`:'—');set('srWorstLossMeta',worst?`${worst.m.team} • ${worst.m.opponent||''}`:'Aucune défaite calculable');
 set('srGoalsGame',prolific?`${prolific.pair.fc}-${prolific.pair.opp}`:'—');set('srGoalsGameMeta',prolific?`${prolific.m.team} • ${prolific.m.opponent||''}`:'Aucun résultat');
 const me=document.getElementById('srMonths');if(me)me.innerHTML=statsBarsHtml(months,24);
}



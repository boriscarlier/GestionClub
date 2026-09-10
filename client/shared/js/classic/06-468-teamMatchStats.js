function teamMatchStats(team){
 const ms=(state.matches||[]).filter(m=>norm(m.team||m.sourceTeam||'')===norm(team));
 let played=0,remaining=0,w=0,d=0,l=0,gf=0,ga=0,unknown=0,home=0,away=0;
 const calc=[];
 ms.forEach(m=>{
  const finished=(typeof publicMatchIsFinished==='function')?publicMatchIsFinished(m):(typeof hasMatchScore==='function'&&hasMatchScore(m));
  if(!finished){remaining++;return}
  played++;const pair=statisticsScorePair(m);if(!pair){unknown++;return}
  gf+=pair.fc;ga+=pair.opp;
  const r=pair.fc>pair.opp?'V':pair.fc<pair.opp?'D':'N';if(r==='V')w++;else if(r==='N')d++;else l++;
  const ha=norm(m.homeAway||'');if(ha.includes('recev')||ha.includes('domic'))home++;else if(ha.includes('visit')||ha.includes('ext'))away++;
  calc.push({m,pair,r});
 });
 calc.sort((a,b)=>String(a.m.date||'').localeCompare(String(b.m.date||'')));
 let streak='—';
 if(calc.length){const last=calc[calc.length-1].r;let n=0;for(let i=calc.length-1;i>=0&&calc[i].r===last;i--)n++;streak=`${last}${n}`;}
 return {team,ms,played,remaining,w,d,l,gf,ga,unknown,home,away,calc,streak};
}

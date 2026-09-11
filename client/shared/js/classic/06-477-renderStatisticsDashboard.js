function renderStatisticsDashboard(){
 renderStatisticsSourceSummary();
 const root=document.getElementById('statistics');if(!root)return;
 const s=statisticsSummary();
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};

 set('statsMembers',s.members);
 set('statsTeams',s.teams);
 set('statsMatches',s.matches);
 set('statsPlayed',s.played);
 set('statsRemaining',s.remaining);
 set('statsRemainingSub',s.remaining===1?'1 match à jouer':`${s.remaining} matchs à jouer`);
 set('statsWins',s.wins);
 set('statsDraws',s.draws);
 set('statsLosses',s.losses);
 set('statsGoalDiff',(s.goalDiff>0?'+':'')+s.goalDiff);
 set('statsGoalsSub',`${s.gf} marqués • ${s.ga} encaissés`);
 set('statsDiscipline',s.discipline);
 set('statsDisciplineSub',`${s.activeDisc} actif(s)`);
 set('statsOpponents',s.opponents);
 set('statsImportsOk',`${s.importsOk}/4`);
 set('statsImportsSub',s.importsOk===4?'Toutes les bases suivies sont à jour':'Certaines bases nécessitent une vérification');
 set('statsCompleteness',`${s.completeness}%`);
 set('statsWinsBox',s.wins);set('statsDrawsBox',s.draws);set('statsLossesBox',s.losses);
 set('statsGoalsFor',s.gf);set('statsGoalsAgainst',s.ga);set('statsUnknownResults',s.unknown);
 set('statsDiscTotal',s.discipline);set('statsDiscActive',s.activeDisc);
 set('statsDiscPeople',s.discPeople);set('statsDiscMatches',s.discMatches);

 const bars=document.getElementById('statsCategoryBars');
 if(bars){
  const entries=sortStatisticsCategories(Object.entries(s.categories));
  const max=Math.max(1,...entries.map(x=>x[1]));
  bars.innerHTML=entries.length?entries.slice(0,14).map(([name,count])=>`
   <div class="stats-bar-row">
    <div class="tiny" title="${escapeHtml(name)}">${escapeHtml(name)}</div>
    <div class="stats-bar-track"><div class="stats-bar-fill" style="width:${Math.max(4,Math.round(count/max*100))}%"></div></div>
    <strong>${count}</strong>
   </div>`).join(''):'<div class="stats-empty">Aucune donnée licencié importée.</div>';
 }

 const health=document.getElementById('statsImportHealth');
 if(health){
  health.innerHTML=s.importStates.map(x=>{
   const def=IMPORT_SOURCE_DEFS?.[x.type];
   const label=def?.label||x.type;
   const st=x.state;
   const text=st.status==='ok'?'À jour':st.status==='warn'?'À surveiller':(st.label||'Obsolète');
   const badge=st.status==='ok'?'green':st.status==='warn'?'yellow':'red';
   return `<div class="stats-health-row"><span>${def?.icon||'📦'} ${label}</span><span class="badge ${badge}">${text}</span></div>`;
  }).join('');
 }
}


let currentAccountId=null;



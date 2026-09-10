function renderStatisticsTeams(){
 const sel=document.getElementById('stTeamSelect');if(!sel)return;
 const teams=[...new Set([...(state.teams||[]).map(t=>t.name),...(state.matches||[]).map(m=>m.team).filter(Boolean)])];
 if(!sel.options.length)sel.innerHTML=teams.map(t=>`<option>${escapeHtml(t)}</option>`).join('');
 const team=sel.value||teams[0]||'';const s=teamMatchStats(team);const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('stPlayed',s.played);set('stRemaining',s.remaining);set('stWND',`${s.w} / ${s.d} / ${s.l}`);set('stWinRate',`${s.played-s.unknown?Math.round(s.w/Math.max(1,s.played-s.unknown)*100):0}%`);
 set('stGF',s.gf);set('stGA',s.ga);set('stGD',(s.gf-s.ga>0?'+':'')+(s.gf-s.ga));set('stStreak',s.streak);
 const l5=document.getElementById('stLast5');if(l5)l5.innerHTML=s.calc.slice(-5).reverse().map(x=>`<div class="match-card"><strong>${x.r} • ${x.pair.fc}-${x.pair.opp}</strong><div class="tiny">${formatMatchDateFr(x.m.date)} • ${escapeHtml(x.m.opponent||'Adversaire')}</div></div>`).join('')||'<div class="tiny">Aucun résultat calculable.</div>';
 const ha=document.getElementById('stHomeAway');if(ha)ha.innerHTML=`<div class="stats-health-row"><span>Matchs identifiés à domicile</span><strong>${s.home}</strong></div><div class="stats-health-row"><span>Matchs identifiés à l’extérieur</span><strong>${s.away}</strong></div><div class="stats-health-row"><span>Orientation non renseignée</span><strong>${Math.max(0,s.played-s.home-s.away)}</strong></div>`;
 const rem=document.getElementById('stRemainingList');if(rem)rem.innerHTML=s.ms.filter(m=>!publicMatchIsFinished(m)).sort((a,b)=>String(a.date).localeCompare(String(b.date))).map(m=>`<div class="match-card"><strong>${formatMatchDateFr(m.date)} — ${escapeHtml(m.opponent||'Adversaire')}</strong><div class="tiny">${escapeHtml(m.time||'')} • ${escapeHtml(m.place||'Lieu à préciser')}</div></div>`).join('')||'<div class="tiny">Aucun match restant.</div>';
}



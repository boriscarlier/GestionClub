function populateMatchEditFields(m){
 const teamSel=document.getElementById('matchEditTeam');
 if(teamSel){
  const current=matchTeamName(m)||'';
  const teams=[...new Set([...(state.teams||[]).map(t=>t.name),...(state.matches||[]).map(matchTeamName)].filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
  teamSel.innerHTML=teams.map(t=>`<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
  if(current&&!teams.includes(current))teamSel.innerHTML+=`<option value="${escapeHtml(current)}">${escapeHtml(current)}</option>`;
  teamSel.value=current;
 }
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.value=v??''};
 set('matchEditDate',String(m.date||'').slice(0,10));
 set('matchEditTime',m.time||m.rawTime||'');
 set('matchEditOpponent',matchOpponentName(m));
 set('matchEditCompetitionType',m.competitionType||matchCompetitionType(m));
 set('matchEditCompetition',m.competition||m.competitionName||'');
 set('matchEditHomeAway',m.homeAway||'');
 set('matchEditPlace',m.place||m.venue||'');
 set('matchEditCity',m.venueCity||m.city||'');
 set('matchEditStatus',matchStatusValue(m));
 set('matchEditNumber',m.matchNumber||'');
 set('matchEditPhase',m.phase||m.round||m.roundNumber||'');
}

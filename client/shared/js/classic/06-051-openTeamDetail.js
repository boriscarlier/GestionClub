function openTeamDetail(id){
  const t=state.teams.find(x=>x.id===id);
  if(!t||!t.public)return;
  currentTeamId=id;
  document.getElementById('crumbTeamName').textContent=t.name;
  document.getElementById('teamDetailName').textContent=t.name;
  document.getElementById('teamCompetitionKicker').textContent='● '+t.competition;
  document.getElementById('teamDetailSubtitle').textContent=`${t.ground} • Entraînement : ${t.training}`;
  document.getElementById('teamStaffGrid').innerHTML=`
    <div class="staff-card"><strong>Éducateur</strong><div class="tiny">${t.coach}</div></div>
    <div class="staff-card"><strong>Adjoint</strong><div class="tiny">${t.assistant}</div></div>
    <div class="staff-card"><strong>Dirigeant</strong><div class="tiny">${t.manager}</div></div>
    <div class="staff-card"><strong>Terrain</strong><div class="tiny">${t.ground}</div></div>`;
  const roster=state.members.filter(m=>m.category===t.name&&m.type==='Joueur'&&m.public===true);
  document.getElementById('teamRosterGrid').innerHTML=t.rosterPublic
    ? (roster.map(m=>`<div class="player-chip"><strong>${m.first} ${m.last}</strong><div class="tiny">${m.license}</div></div>`).join('')||'<div class="tiny">Effectif public à compléter.</div>')
    : '<div class="tiny">Effectif non publié pour cette équipe.</div>';
  document.getElementById('teamCompetitionBox').innerHTML=`<div class="competition-card"><h4>${t.competition}</h4><div class="tiny">Équipe : ${t.name}</div><div class="tiny">Terrain principal : ${t.ground}</div><div class="tiny">Entraînement : ${t.training}</div></div>`;
  const ranking=(state.rankings&&state.rankings[t.name])||[];
  document.getElementById('teamRankingBody').innerHTML=ranking.length
    ? ranking.map((r,i)=>`<tr><td>${i+1}</td><td>${r.name==='FC LA COUR'?'<strong>FC LA COUR</strong>':r.name}</td><td>${r.pts}</td></tr>`).join('')
    : '<tr><td colspan="3">Classement non renseigné.</td></tr>';
  const fixtures=state.matches.filter(m=>m.team===t.name&&m.public!==false).sort((a,b)=>a.date.localeCompare(b.date));
  document.getElementById('teamFixtures').innerHTML=fixtures.length
    ? fixtures.map(m=>`<div class="fixture"><div><strong>${formatMatchDateFr(m.date)}</strong><div class="tiny">${m.time}</div></div><div><strong>${m.team} vs ${m.opponent}</strong><div class="tiny">${m.place}</div></div><div class="score">${coachMatchPlayed(m)?(coachMatchResultInfo(m).has?coachMatchResultInfo(m).scoreText:'Score à renseigner'):'À venir'}</div></div>`).join('')
    : '<div class="tiny">Aucun match renseigné.</div>';
  showPublicPage('public-teamdetail');
}



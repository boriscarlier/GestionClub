function renderCoachPlayerStats(){
 const panel=document.getElementById('coachPlayerStatsPanel');if(!panel)return;
 const player=coachTeamMembers().find(p=>p.id===coachCurrentStatsPlayerId);
 if(!player){panel.innerHTML='';return;}

 const s=coachPlayerStatSummary(player);
 const trainings=coachPlayerTrainingHistory(player.id);
 const disciplineDetail=s.discipline.issues?.map(x=>x.issue?.title||'').filter(Boolean).join(' • ')||'Aucune situation disciplinaire à vérifier';
 const sportBadge=s.sport.status==='blocked'?'red':s.sport.status==='warning'?'yellow':s.sport.status==='injured'?'yellow':s.sport.status==='absent'?'blue':'green';

 panel.innerHTML=`<div class="coach-card">
  <div class="coach-player-stats-head">
   <div>
    <div class="kicker">Statistiques individuelles</div>
    <h3 style="margin:4px 0">${escapeHtml((player.last||'')+' '+(player.first||''))}</h3>
    <div class="tiny">Licence ${escapeHtml(player.personNumber||'—')} • ${escapeHtml(player.category||coachCurrentTeamName||'—')}</div>
   </div>
   <button class="ghost" onclick="coachClosePlayerStats()">Fermer</button>
  </div>

  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
   <span class="badge ${sportBadge}">${escapeHtml(s.sport.label)}</span>
   <span class="badge ${s.discipline.status==='blocked'?'red':s.discipline.status==='pending'?'yellow':s.discipline.status==='checked'?'blue':'green'}">${escapeHtml(s.discipline.label)}</span>
  </div>

  <div class="coach-player-stats-grid">
   <div class="coach-player-stat"><div class="tiny">Matchs joués</div><strong>${s.matchesPlayed}</strong></div>
   <div class="coach-player-stat"><div class="tiny">Séances</div><strong>${s.train.sessions}</strong></div>
   <div class="coach-player-stat"><div class="tiny">Présences</div><strong>${s.train.present}</strong></div>
   <div class="coach-player-stat"><div class="tiny">Taux de présence</div><strong>${s.train.rate===null?'—':s.train.rate+' %'}</strong></div>
   <div class="coach-player-stat"><div class="tiny">Absences</div><strong>${s.train.absent}</strong></div>
   <div class="coach-player-stat"><div class="tiny">Excusés</div><strong>${s.train.excused}</strong></div>
   <div class="coach-player-stat"><div class="tiny">Blessé aux séances</div><strong>${s.train.injured}</strong></div>
   <div class="coach-player-stat"><div class="tiny">À renseigner</div><strong>${s.train.pending}</strong></div>
  </div>

  <div class="coach-discipline-box">
   <strong>Situation disciplinaire</strong>
   <div class="tiny">${escapeHtml(disciplineDetail)}</div>
  </div>

  <div class="coach-player-history">
   <div>
    <h4>Historique matchs</h4>
    <div class="coach-player-history-list">
     ${s.matchHistory.length?s.matchHistory.map(m=>`<div class="coach-player-history-item"><strong>${formatMatchDateFr(m.date)} — ${escapeHtml(m.opponent)}</strong><div class="tiny">${escapeHtml(m.team||'')} • ${escapeHtml(m.place||'—')} • ${m.played?'Comptabilisé comme joué':'Composition préparée / match non terminé'}</div></div>`).join(''):'<div class="tiny">Aucun match enregistré dans une composition.</div>'}
    </div>
   </div>
   <div>
    <h4>Historique entraînements</h4>
    <div class="coach-player-history-list">
     ${trainings.length?trainings.map(t=>`<div class="coach-player-history-item"><strong>${formatMatchDateFr(t.date)} — ${escapeHtml(t.title)}</strong><div class="tiny">${escapeHtml(t.time||'—')} • ${escapeHtml(t.place||'—')} • <span class="badge ${coachAttendanceBadge(t.status)}">${coachAttendanceLabel(t.status)}</span></div></div>`).join(''):'<div class="tiny">Aucune séance enregistrée.</div>'}
    </div>
   </div>
  </div>
 </div>`;
}




function renderPlanning(){
 if(!document.getElementById('planningGrid'))return;
 ensurePlanningEventIds();
 const days=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
 const events=planningFilteredEvents();
 const conflicts=detectPlanningConflicts(events);
 const conflictIds=new Set(conflicts.flat().map(e=>e.id));

 const teamSel=document.getElementById('planningTeamFilter');
 if(teamSel){
  const current=teamSel.value;
  const teams=[...new Set([...(state.teams||[]).map(t=>t.name),...(state.planning||[]).map(e=>e.team)].filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
  teamSel.innerHTML='<option value="">Toutes les équipes</option>'+teams.map(t=>`<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
  if(teams.includes(current))teamSel.value=current;
 }

 document.getElementById('planningGrid').innerHTML=days.map((d,idx)=>{
  const dayEvents=events.filter(e=>Number(e.day)===idx).sort((a,b)=>String(a.time||'').localeCompare(String(b.time||'')));
  return `<div class="plan-day"><strong>${d}</strong>${dayEvents.length?dayEvents.map(e=>`
   <div class="plan-event ${escapeHtml(e.type||'event')} ${conflictIds.has(e.id)?'conflict':''}">
    <strong>${escapeHtml(e.time||'—')} — ${escapeHtml(e.title||planningTypeLabel(e.type))}</strong>
    <div class="tiny">${escapeHtml(e.place||'Lieu à préciser')}${e.team?' • '+escapeHtml(e.team):''} • ${Number(e.duration||60)} min</div>
    <div class="plan-event-actions">
     <button class="secondary" type="button" onclick="event.stopPropagation();openPlanningEditorSafe('${e.id}')">Modifier</button>
     <button class="ghost" type="button" onclick="event.stopPropagation();deletePlanningEventById('${e.id}')">Supprimer</button>
    </div>
   </div>`).join(''):'<div class="tiny">—</div>'}</div>`;
 }).join('');

 const allPlanning=state.planning||[];
 document.getElementById('planMatches').textContent=(state.matches||[]).length;
 document.getElementById('planTrainings').textContent=allPlanning.filter(e=>e.type==='training').length;
 document.getElementById('planEvents').textContent=allPlanning.filter(e=>['meeting','event'].includes(e.type)).length;
 document.getElementById('planConflicts').textContent=detectPlanningConflicts(allPlanning).length;

 document.getElementById('conflictList').innerHTML=conflicts.length?conflicts.map(([a,b])=>`
  <div class="conflict-box">
   <strong>${escapeHtml(a.title||'Événement')} ↔ ${escapeHtml(b.title||'Événement')}</strong>
   <div class="tiny">${days[Number(a.day)]} • ${escapeHtml(a.place||'')} • chevauchement horaire</div>
   <div class="conflict-actions">
    <button class="secondary" type="button" onclick="openPlanningEditorSafe('${a.id}')">Modifier ${escapeHtml(a.title||'événement 1')}</button>
    <button class="secondary" type="button" onclick="openPlanningEditorSafe('${b.id}')">Modifier ${escapeHtml(b.title||'événement 2')}</button>
    <button class="ghost" type="button" onclick="deletePlanningEventById('${a.id}')">Supprimer 1</button>
    <button class="ghost" type="button" onclick="deletePlanningEventById('${b.id}')">Supprimer 2</button>
   </div>
  </div>`).join(''):'<div class="tiny">Aucun conflit détecté avec les filtres actuels.</div>';

 const official=document.getElementById('planningOfficialMatches');
 if(official){
  const upcoming=publicVisibleMatches().filter(matchIsUpcoming).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))).slice(0,12);
  official.innerHTML=upcoming.length?upcoming.map(m=>`
   <div class="planning-official-match" onclick="openMatchDetail('${m.id}')">
    <strong>${escapeHtml(formatMatchDateFr(m.date))} — ${escapeHtml(matchTeamName(m)||'CLUB EXEMPLE')} / ${escapeHtml(matchOpponentName(m)||'Adversaire')}</strong>
    <div class="dash-match-meta">${matchHomeAwayBadge(m)}<span class="badge ${matchCompetitionType(m)==='Coupe'?'yellow':matchCompetitionType(m)==='Championnat'?'green':'blue'}">${matchCompetitionType(m)==='Coupe'?'🏆 ':matchCompetitionType(m)==='Championnat'?'🏁 ':matchCompetitionType(m)==='Match amical'?'🤝 ':''}${escapeHtml(matchCompetitionType(m))}</span></div>
    <div class="tiny">${escapeHtml(m.time||'Horaire à préciser')} • ${escapeHtml(m.place||'Lieu à préciser')}</div>
   </div>`).join(''):'<div class="tiny">Aucun match officiel à venir.</div>';
 }

 const addBtn=document.getElementById('planningAddBtn');
 if(addBtn)addBtn.style.display=currentAdminCan('teams','edit')?'':'none';
}

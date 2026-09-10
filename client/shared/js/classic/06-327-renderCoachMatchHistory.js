function renderCoachMatchHistory(){
 const root=document.getElementById('coachMatchHistoryList');if(!root)return;
 const matches=coachPlayedTeamMatches();
 const count=document.getElementById('coachPlayedMatchesCount');
 if(count)count.textContent=`${matches.length} match${matches.length>1?'s':''}`;

 root.innerHTML=matches.length?matches.map(m=>{
  const result=coachMatchResultInfo(m);
  const homeAway=matchHomeAwayLabel(m);
  const comp=coachMatchCompetitionInfo(m);
  const lineup=coachLineupExistsForMatch(m.id);
  const opponent=coachMatchOpponentLabel(m);
  return `<div class="coach-result-card">
   <div>
    <strong>${escapeHtml(matchTeamName(m)||coachCurrentTeamName||'FC LA COUR')} — ${escapeHtml(opponent)}</strong>
    <div class="tiny">${formatMatchDateFr(m.date)} • ${escapeHtml(m.time||m.rawTime||'—')} • ${escapeHtml(m.place||m.venue||'—')}</div>
    <div class="tiny" style="margin-top:4px"><strong>Compétition :</strong> ${escapeHtml(comp.name||'Non renseignée')}${comp.phase?' • '+escapeHtml(comp.phase):''}</div>
    <div class="coach-result-meta">
     <span class="badge ${result.className}">${result.label}</span>
     <span class="badge">${escapeHtml(homeAway)}</span>
     <span class="badge blue">${escapeHtml(comp.type||'Autre')}</span>
     <span class="badge ${lineup?'green':'yellow'}">${lineup?'Composition enregistrée':'Composition absente'}</span>
    </div>
   </div>
   ${coachMatchScoreHtml(m)}
  </div>`;
 }).join(''):'<div class="tiny">Aucun match joué enregistré pour cette équipe.</div>';
}


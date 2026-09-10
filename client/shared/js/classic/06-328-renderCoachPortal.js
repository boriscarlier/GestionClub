function renderCoachPortal(){
 const m=coachMember();if(!m)return;
 const teams=coachEligibleTeams(m);
 if(!teams.length){coachLogout();return;}
 if(!coachCurrentTeamName||!teams.includes(coachCurrentTeamName))coachCurrentTeamName=teams[0];
 const login=document.getElementById('coachLogin'),app=document.getElementById('coachApp');
 if(login)login.style.display='none';if(app)app.style.display='block';
 const initials=((m.first||'').slice(0,1)+(m.last||'').slice(0,1)).toUpperCase()||'ED';
 const coachDisplayName=`${m.first||''} ${m.last||''}`.trim();
 document.getElementById('coachAvatar').textContent=initials;
 document.getElementById('coachName').textContent=coachDisplayName;
 const mobileAvatar=document.getElementById('coachMobileAvatar');if(mobileAvatar)mobileAvatar.textContent=initials;
 const mobileName=document.getElementById('coachMobileName');if(mobileName)mobileName.textContent=coachDisplayName||'Éducateur';

 const teamSelect=document.getElementById('coachTeamSelect');
 const mobileTeamSelect=document.getElementById('coachMobileTeamSelect');
 const choices=teams.length?teams:[coachCurrentTeamName].filter(Boolean);
 const teamOptions=choices.map(t=>`<option value="${escapeHtml(t)}" ${t===coachCurrentTeamName?'selected':''}>${escapeHtml(t)}</option>`).join('');
 if(teamSelect)teamSelect.innerHTML=teamOptions;
 if(mobileTeamSelect)mobileTeamSelect.innerHTML=teamOptions;
 document.getElementById('coachTeamLabel').textContent=coachCurrentTeamName||'Aucune équipe';
 const linkedAccount=accountLinkedToMember(m);
 const scopeLabel=document.getElementById('coachScopeLabel');
 if(scopeLabel){
  const base=linkedAccount?.scope?.type==='club'?'Périmètre club':linkedAccount?.scope?.type==='sport'?'Périmètre sportif':'Périmètre catégorie + catégorie inférieure';
  scopeLabel.textContent=base;
 }
 document.getElementById('coachDashboardTitle').textContent='Tableau de bord — '+(coachCurrentTeamName||'Équipe');
 const trainingDateInput=document.getElementById('coachTrainingDate');
 if(trainingDateInput&&!trainingDateInput.value)trainingDateInput.value=new Date().toISOString().slice(0,10);

 const players=coachTeamMembers();
 const statuses=players.map(coachPlayerStatus);
 const available=statuses.filter(s=>s.status==='available').length;
 const injured=statuses.filter(s=>s.status==='injured').length;
 const absent=statuses.filter(s=>s.status==='absent').length;
 const alerts=statuses.filter(s=>['blocked','warning'].includes(s.status)).length;
 const matches=coachTeamMatches(),today=new Date().toISOString().slice(0,10),next=matches.find(x=>x.date>=today&&x.status!=='Terminé');
 document.getElementById('coachKpiRoster').textContent=players.length;
 document.getElementById('coachKpiAvailable').textContent=available;
 const kpiInjured=document.getElementById('coachKpiInjured');if(kpiInjured)kpiInjured.textContent=injured;
 const kpiAbsent=document.getElementById('coachKpiAbsent');if(kpiAbsent)kpiAbsent.textContent=absent;
 document.getElementById('coachKpiAlerts').textContent=alerts;
 document.getElementById('coachKpiNext').textContent=next?`${formatMatchDateFr(next.date)} • ${next.opponent}`:'—';

 document.getElementById('coachAlertsList').innerHTML=players.filter(p=>coachPlayerStatus(p).status!=='available'||coachDisciplineReviewState(p).status==='pending').map(p=>{
  const st=coachPlayerStatus(p),elig=memberEligibilityStatus(p),disc=coachDisciplineReviewState(p);
  const detail=disc.status==='pending'?'Situation disciplinaire à vérifier':st.source==='regulatory'?(elig.issues||[]).map(i=>i.title).join(' • '):'Statut sportif renseigné par l’éducateur';
  return `<div class="auto-proposal ${st.status==='blocked'?'critical':'warning'}"><strong>${escapeHtml((p.last||'')+' '+(p.first||''))} — ${disc.status==='pending'?'Discipline à vérifier':st.label}</strong><div class="tiny">${escapeHtml(detail)}</div></div>`;
 }).join('')||'<div class="tiny">Aucune alerte.</div>';

 const q=norm(document.getElementById('coachRosterQuery')?.value||''),filter=document.getElementById('coachRosterFilter')?.value||'';
 const roster=players.filter(p=>{
  const matchesQuery=!q||memberSearchText(p).includes(q);
  if(!matchesQuery)return false;
  if(!filter)return true;
  if(filter==='discipline')return coachDisciplineReviewState(p).status==='pending';
  return coachPlayerStatus(p).status===filter;
 });
 document.getElementById('coachRosterList').innerHTML=roster.map(p=>{
  const st=coachPlayerStatus(p);
  const elig=memberEligibilityStatus(p);
  return `<div class="coach-player ${st.status==='blocked'?'blocked':st.status==='warning'?'warn':''}"><div><strong>${escapeHtml((p.last||'')+' '+(p.first||''))}</strong><div class="tiny">Licence ${escapeHtml(p.personNumber||'—')} • <span class="coach-games-count">${coachMemberGamesPlayed(p.id)} match(s) joué(s)</span></div><div style="margin-top:6px"><button class="ghost" onclick="coachOpenPlayerStats('${p.id}')">Statistiques</button></div></div><div>${escapeHtml(p.category||'—')}</div><div><span class="badge ${st.status==='blocked'?'red':st.status==='warning'?'yellow':st.status==='injured'?'yellow':st.status==='absent'?'blue':'green'}">${st.label}</span><div class="tiny">${escapeHtml((elig.issues||[]).filter(i=>i.kind!=='discipline').map(i=>i.title).join(' • '))}</div>${coachDisciplineHtml(p)}</div><div>${coachAvailabilitySelectHtml(p)}</div></div>`;
 }).join('')||`<div class="coach-card"><strong>Aucun joueur dans ${escapeHtml(coachCurrentTeamName||'cette équipe')}</strong><div class="tiny">Aucun licencié joueur importé n’est actuellement rattaché à cette catégorie. Vérifier les champs Catégorie / Sous-catégorie dans l’import Licenciés.</div></div>`;
 renderCoachPlayerStats();

 document.getElementById('coachMatchesList').innerHTML=matches.map(mt=>{
  const fmi=coachFmiState()[mt.id]||{};
  const deadline=coachFmiDeadlineState(mt);
  const regularization=coachMatchNeedsRegularization(mt);
  const result=coachMatchResultInfo(mt);
  const comp=coachMatchCompetitionInfo(mt);
  const opponent=coachMatchOpponentLabel(mt);
  const homeAway=matchHomeAwayLabel(mt);
  const badgeClass=regularization?'yellow':fmi.prepared?'green':deadline.status==='due'?'red':deadline.status==='past'?'yellow':'blue';
  const badgeLabel=regularization?'COMPOSITION MANQUANTE — À RÉGULARISER':fmi.prepared?'FMI PRÉPARÉE':deadline.label;
  return `<div class="coach-match">
   <strong>${escapeHtml(matchTeamName(mt)||coachCurrentTeamName||'FC LA COUR')} — ${escapeHtml(opponent)}</strong>
   <div class="tiny">${formatMatchDateFr(mt.date)} • ${escapeHtml(mt.time||mt.rawTime||'—')} • ${escapeHtml(mt.place||mt.venue||'—')}</div>
   <div class="tiny" style="margin-top:4px"><strong>Compétition :</strong> ${escapeHtml(comp.name||'Non renseignée')} • ${escapeHtml(comp.type||'Autre')} • ${escapeHtml(homeAway)}</div>
   ${coachMatchPlayed(mt)?`<div style="margin-top:8px">${coachMatchScoreHtml(mt)} <span class="badge ${result.className}">${result.label}</span></div>`:''}
   <div style="margin-top:6px"><span class="badge ${badgeClass}">${badgeLabel}</span></div>
   <div class="actions" style="margin-top:6px">
    <button class="ghost" onclick="document.getElementById('coachLineupMatch').value='${mt.id}';coachGo('lineup');renderCoachLineup()">${regularization?'Régulariser la composition':'Préparer la composition'}</button>
    ${regularization?'':'<button class="ghost" onclick="openOfficialFmiPreparation()">↗ FMI FFF</button>'}
   </div>
  </div>`;
 }).join('')||'<div class="tiny">Aucun match actif ou à régulariser.</div>';
 renderCoachMatchHistory();

 qaSyncMatchSelectors();
 renderCoachCallup();renderCoachLineup();

 renderCoachTrainingOverview();
 renderCoachTrainingAttendance();

 document.getElementById('coachContactsList').innerHTML=players.map(p=>`<div class="coach-contact"><strong>${escapeHtml((p.last||'')+' '+(p.first||''))}</strong><div class="tiny">Joueur : ${escapeHtml(p.phone||p.mobile||'—')} • Parent : ${escapeHtml(p.guardian1Mobile||p.guardianPhone||'—')} • ${escapeHtml(p.guardian1Email||p.guardianEmail||p.email||'—')}</div></div>`).join('')||'<div class="tiny">Aucun contact disponible pour cette équipe.</div>';
 syncCoachMobileNavigation();
 coachGo(coachCurrentPage||'home');
}

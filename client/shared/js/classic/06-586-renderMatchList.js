function renderMatchList(){
 const tbody=document.getElementById('matchRows');
 if(!tbody)return;

 // purge stale selection after imports/deletes
 const validIds=new Set((state.matches||[]).map(m=>m.id));
 [...selectedMatchIds].forEach(id=>{if(!validIds.has(id))selectedMatchIds.delete(id);});

 const teamSel=document.getElementById('matchTeamFilter');
 if(teamSel){
  const current=teamSel.value;
  const teams=[...new Set((state.matches||[]).map(matchTeamName).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
  teamSel.innerHTML='<option value="">Toutes les équipes</option>'+teams.map(t=>`<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
  if(teams.includes(current))teamSel.value=current;
 }

 const statuses=[...new Set((state.matches||[]).map(matchStatusValue).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
 const statusBox=document.getElementById('matchStatusFilters');
 if(statusBox){
  statusBox.innerHTML=
   `<button class="ghost ${matchStatusFilter===''?'active':''}" data-match-filter="" onclick="setMatchStatusFilter('',this)">Tous</button>`+
   statuses.map(st=>`<button class="ghost ${matchStatusFilter===st?'active':''}" data-match-filter="${escapeHtml(st)}" onclick="setMatchStatusFilter('${String(st).replace(/\\/g,'\\\\').replace(/'/g,"\\'")}',this)">${escapeHtml(st)}</button>`).join('');
  if(matchStatusFilter && !statuses.includes(matchStatusFilter))matchStatusFilter='';
 }

 const allMatches=state.matches||[];
 const played=allMatches.filter(matchIsFinished);
 const upcoming=allMatches.filter(matchIsUpcoming);
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('matchKpiTotal',allMatches.length);
 set('matchKpiLeague',allMatches.filter(m=>matchCompetitionType(m)==='Championnat').length);
 set('matchKpiCup',allMatches.filter(m=>matchCompetitionType(m)==='Coupe').length);
 set('matchKpiFriendly',allMatches.filter(m=>matchCompetitionType(m)==='Match amical').length);
 set('matchKpiUpcoming',upcoming.length);
 set('matchKpiPlayed',played.length);
 set('matchKpiTeams',new Set(allMatches.map(matchTeamName).filter(Boolean)).size);
 set('matchKpiOpponents',new Set(allMatches.map(matchOpponentName).filter(Boolean)).size);

 const addBtn=document.getElementById('matchAddBtn');
 if(addBtn)addBtn.style.display=currentAdminCan('matches','create')?'':'none';

 const canEdit=currentAdminCan('matches','edit');
 const canDelete=currentAdminCan('matches','delete');

 const arr=filteredMatchesForAdmin();
 tbody.innerHTML=arr.map(m=>{
  const sc=matchDisplayScores(m),hasScore=hasMatchScore(m),selected=selectedMatchIds.has(m.id);
  const label=matchStatusValue(m);
  const stClass=norm(label).includes('termin')?'green':norm(label).includes('venir')?'blue':norm(label).includes('report')?'yellow':'yellow';
  const opp=matchOpponentName(m)||'—';
  return `<tr class="${selected?'match-row-selected':''}" onclick="openMatchDetail('${m.id}')" title="Ouvrir la fiche du match">
   <td class="match-select-cell"><input type="checkbox" ${selected?'checked':''} onclick="event.stopPropagation()" onchange="toggleMatchSelection('${m.id}',this.checked)"></td>
   <td><strong>${escapeHtml(formatMatchDateFr(m.date))}</strong>${m.time?`<div class="tiny">${escapeHtml(m.time)}</div>`:''}</td>
   <td>${escapeHtml(matchTeamName(m)||'—')}</td>
   <td>${escapeHtml(opp)}</td>
   <td>${matchHomeAwayBadge(m)}</td>
   <td><span class="badge ${matchCompetitionType(m)==='Coupe'?'yellow':matchCompetitionType(m)==='Championnat'?'green':matchCompetitionType(m)==='Match amical'?'blue':''}">${escapeHtml(matchCompetitionType(m))}</span></td>
   <td>${escapeHtml(m.competition||m.competitionName||'—')}</td>
   <td>${escapeHtml(m.place||m.venue||'—')}</td>
   <td>${hasScore?escapeHtml(String(sc.fc))+' - '+escapeHtml(String(sc.opp)):'—'}</td>
   <td><span class="badge ${stClass}">${escapeHtml(label)}</span></td>
   <td style="white-space:nowrap">
    <button class="secondary" onclick="event.stopPropagation();openMatchDetail('${m.id}')">Détail</button>
    ${canEdit&&!hasScore?`<button class="primary" onclick="event.stopPropagation();editScore('${m.id}')">Saisir score</button>`:''}
    ${canDelete?`<button class="ghost" onclick="event.stopPropagation();deleteMatchById('${m.id}')">Supprimer</button>`:''}
   </td>
  </tr>`;
 }).join('')||'<tr><td colspan="11" class="tiny">Aucun match correspondant aux critères.</td></tr>';

 const count=document.getElementById('matchSelectionCount');
 if(count)count.textContent=`${selectedMatchIds.size} sélectionné${selectedMatchIds.size>1?'s':''}`;

 const all=document.getElementById('matchSelectAll');
 if(all){
  const visibleIds=arr.map(m=>m.id);
  all.checked=visibleIds.length>0 && visibleIds.every(id=>selectedMatchIds.has(id));
  all.indeterminate=visibleIds.some(id=>selectedMatchIds.has(id)) && !all.checked;
 }

 if(typeof applyClubLogoAssets==='function')applyClubLogoAssets(document);
}

let currentMatchId=null;


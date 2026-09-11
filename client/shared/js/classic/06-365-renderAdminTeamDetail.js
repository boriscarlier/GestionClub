function renderAdminTeamDetail(){
 const t=adminTeamById(currentAdminTeamId);
 if(!t){
  const title=document.getElementById('adminTeamDetailTitle');if(title)title.textContent='Équipe introuvable';
  return;
 }

 const account=typeof currentAdminAccount==='function'?currentAdminAccount():null;
 const unrestricted=!(state.accounts||[]).length;
 const canDiscipline=unrestricted || (typeof accountCanSeeSensitive==='function'&&accountCanSeeSensitive(account,'discipline'));

 const title=document.getElementById('adminTeamDetailTitle');
 const subtitle=document.getElementById('adminTeamDetailSubtitle');
 if(title)title.textContent=t.name||'Équipe';
 if(subtitle)subtitle.textContent=`${t.competition||'Compétition non renseignée'} • ${t.ground||'Terrain non renseigné'}`;

 const roster=(state.members||[]).filter(m=>teamMemberBelongsTo(m,t));
 const players=roster.filter(m=>norm(m.type||m.licenseType||'').includes('joueur') || !String(m.type||m.licenseType||'').trim());
 const matches=(state.matches||[]).filter(m=>norm(m.team||m.sourceTeam||'')===norm(t.name)).sort((a,b)=>String(a.date||'').localeCompare(String(b.date||'')));
 const remaining=matches.filter(m=>!(typeof publicMatchIsFinished==='function'?publicMatchIsFinished(m):(typeof hasMatchScore==='function'&&hasMatchScore(m))));
 const planning=(state.planning||[]).filter(e=>norm(e.team||'')===norm(t.name));

 const grid=document.getElementById('adminTeamDetailGrid');
 if(grid)grid.innerHTML=[
  teamDetailItem('Nom',t.name),
  teamDetailItem('Compétition',t.competition),
  teamDetailItem('Groupe',t.group),
  teamDetailItem('Joueurs rattachés',players.length),
  teamDetailItem('Matchs',matches.length),
  teamDetailItem('Matchs restant à jouer',remaining.length),
  teamDetailItem('Terrain principal',t.ground),
  teamDetailItem('Entraînement',t.training),
  teamDetailItem('Fiche publique',t.public?'Oui':'Non'),
  teamDetailItem('Effectif public',t.rosterPublic?'Oui':'Non')
 ].join('');

 const staff=document.getElementById('adminTeamStaff');
 if(staff)staff.innerHTML=[
  teamDetailItem('Éducateur',t.coach),
  teamDetailItem('Adjoint',t.assistant),
  teamDetailItem('Dirigeant',t.manager)
 ].join('');

 const rosterBox=document.getElementById('adminTeamRoster');
 if(rosterBox)rosterBox.innerHTML=roster.length?roster.map(m=>{
  const ds=canDiscipline?teamMemberDisciplineState(m):{level:'restricted',label:'Discipline restreinte',dossiers:[],details:[]};
  const details=canDiscipline?(ds.details.length?ds.details.slice(0,2).join(' • '):(ds.dossiers.length?`${ds.dossiers.length} dossier(s) lié(s)`:'Aucun dossier actif')):'Accès aux données disciplinaires restreint';
  const badge=canDiscipline?teamMemberStatusBadge(ds):'<span class="badge">Discipline restreinte</span>';
  return `<div class="team-detail-item team-player-row ${canDiscipline&&ds.level==='suspended'?'suspended':canDiscipline&&ds.level==='warning'?'warning':''}">
   <div>
    <strong>${escapeHtml(`${m.last||''} ${m.first||''}`.trim())}</strong>
    <div class="tiny">${escapeHtml(m.type||m.licenseType||'—')} • Licence ${escapeHtml(m.licenseNumber||m.license||'—')}</div>
   </div>
   <div class="team-player-status">${badge}${canDiscipline&&ds.dossiers.length?`<span class="badge">${ds.dossiers.length} dossier${ds.dossiers.length>1?'s':''}</span>`:''}</div>
   <div class="tiny">${escapeHtml(details)}</div>
   <button class="ghost" onclick="openMemberDetail('${m.id}')">Fiche licencié</button>
  </div>`;
 }).join(''):'<div class="tiny">Aucun licencié lié à cette équipe.</div>';

 const matchBox=document.getElementById('adminTeamMatches');
 if(matchBox)matchBox.innerHTML=matches.length?matches.map(m=>`
  <div class="team-detail-item" style="cursor:pointer" onclick="openMatchDetail('${m.id}')">
   <strong>${typeof formatMatchDateFr==='function'?formatMatchDateFr(m.date):escapeHtml(m.date||'—')} — ${escapeHtml(m.opponent||m.opponentClub||'—')}</strong>
   <div class="tiny">${escapeHtml(m.time||'—')} • ${escapeHtml(m.place||'—')} • ${escapeHtml(typeof matchStatusValue==='function'?matchStatusValue(m):(m.status||'—'))}</div>
  </div>`).join(''):'<div class="tiny">Aucun match lié.</div>';

 const planningBox=document.getElementById('adminTeamPlanning');
 if(planningBox)planningBox.innerHTML=planning.length?planning.map(e=>`
  <div class="team-detail-item">
   <strong>${escapeHtml(e.title||e.type||'Événement')}</strong>
   <div class="tiny">${escapeHtml(String(e.day??'—'))} • ${escapeHtml(e.time||'—')} • ${escapeHtml(e.place||'—')}</div>
  </div>`).join(''):'<div class="tiny">Aucun élément de planning lié.</div>';

 if(typeof applyClubLogoAssets==='function')applyClubLogoAssets(document);
}


let opponentLogoDraft='';





let fffImportMode='auto';
let opponentFffDirectoryDraft=[];


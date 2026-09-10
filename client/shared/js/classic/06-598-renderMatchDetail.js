function renderMatchDetail(){
 const m=matchById(currentMatchId);
 if(!m)return;
 const scores=matchDisplayScores(m);
 const canEdit=currentAdminCan('matches','edit');
 const canDelete=currentAdminCan('matches','delete');

 const title=document.getElementById('matchDetailTitle');
 const subtitle=document.getElementById('matchDetailSubtitle');
 if(title)title.textContent=`${m.team||'FC LA COUR'} — ${m.opponent||'Adversaire'}`;
 if(subtitle)subtitle.textContent=`${m.date||'Date non renseignée'} • ${m.time||'Heure non renseignée'} • ${m.competition||'Compétition non renseignée'}`;
 populateMatchEditFields(m);

 const grid=document.getElementById('matchDetailGrid');
 if(grid)grid.innerHTML=[
  matchDetailItem('N° match',m.matchNumber),
  matchDetailItem('Type de rencontre',matchCompetitionType(m)),
  matchDetailItem('Compétition',m.competition||m.competitionName),
  matchDetailItem('Phase',m.phase),
  matchDetailItem('Poule',m.pool),
  matchDetailItem('Journée',m.dayNumber),
  matchDetailItem('Tour',m.round||m.roundNumber),
  matchDetailItem('Date',formatMatchDateFr(m.date)),
  matchDetailItem('Heure',m.time||m.rawTime),
  matchDetailItem('Équipe FC LA COUR',m.team),
  matchDetailItem('Adversaire',m.opponent),
  matchDetailItem('Domicile / extérieur',matchHomeAwayLabel(m)),
  matchDetailItem('Installation',m.place),
  matchDetailItem('Ville',m.venueCity),
  matchDetailItem('Adresse',m.fullAddress||m.address),
  matchDetailItem('Statut',m.status),
  matchDetailItem('Report / rejoué',m.rescheduleStatus),
  matchDetailItem('Date de report',m.rescheduleDate),
  matchDetailItem('Affiche source',m.teamsLabel)
 ].join('');

 const fcInput=document.getElementById('matchDetailFcScore');
 const oppInput=document.getElementById('matchDetailOppScore');
 if(fcInput)fcInput.value=scores.fc??'';
 if(oppInput)oppInput.value=scores.opp??'';
 const scoreState=document.getElementById('matchScoreState');
 const saveBtn=document.getElementById('matchSaveScoreBtn');
 if(scoreState)scoreState.textContent=hasMatchScore(m)?`Score enregistré : ${scores.fc} - ${scores.opp}`:'Aucun score enregistré pour ce match.';
 if(saveBtn)saveBtn.textContent=hasMatchScore(m)?'Corriger le score':'Enregistrer le score';
 const infoBtn=document.getElementById('matchSaveInfoBtn');if(infoBtn)infoBtn.style.display=canEdit?'':'none';
 document.querySelectorAll('#matchdetail input[id^="matchEdit"],#matchdetail select[id^="matchEdit"]').forEach(el=>el.disabled=!canEdit);
 const deleteBtn=document.getElementById('matchDeleteBtn');if(deleteBtn)deleteBtn.style.display=canDelete?'':'none';
 cancelDeleteCurrentMatch();

 const source=document.getElementById('matchSourceData');
 if(source){
  const obj=m.sourceData&&typeof m.sourceData==='object'?m.sourceData:m;
  const entries=Object.entries(obj).filter(([k,v])=>v!==null&&v!==undefined&&String(v).trim()!=='');
  source.innerHTML=entries.length?entries.map(([k,v])=>`<div><strong>${k}</strong> : ${String(v)}</div>`).join(''):'Aucune donnée source complémentaire.';
 }
 
 const links=document.getElementById('matchDetailLinks');
 if(links){
  const team=(state.teams||[]).find(t=>norm(t.name||'')===norm(matchTeamName(m)));
  const opp=findOpponentForMatch(m);
  links.innerHTML=[
   team?`<button class="ghost" onclick="openAdminTeamDetail('${team.id}')">🧩 Voir l’équipe</button>`:'',
   opp?`<button class="ghost" onclick="openOpponentDetail('${opp.id}')">🛡️ Voir le club adverse</button>`:'',
   `<button class="ghost" onclick="goTo('planning')">📆 Voir le planning</button>`
  ].join('');
 }
 const scoreInputs=[document.getElementById('matchDetailFcScore'),document.getElementById('matchDetailOppScore')];
 scoreInputs.forEach(el=>{if(el)el.disabled=!canEdit;});
 const matchPermissionSaveBtn=document.getElementById('matchSaveScoreBtn');if(matchPermissionSaveBtn)matchPermissionSaveBtn.style.display=canEdit?'':'none';
 const matchPermissionDeleteBtn=document.querySelector('#matchdetail .danger');if(matchPermissionDeleteBtn)matchPermissionDeleteBtn.style.display=canDelete?'':'none';

 applyClubLogoAssets?.(document);
}

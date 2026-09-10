function renderDiscipline(){
 const list=document.getElementById('disciplineList');if(!list)return;
 syncDisciplineLifecycle();
 const account=typeof currentAdminAccount==='function'?currentAdminAccount():null;
 const unrestricted=!(state.accounts||[]).length;
 const canDiscipline=unrestricted || (typeof accountCanSeeSensitive==='function'&&accountCanSeeSensitive(account,'discipline'));

 if(!canDiscipline){
  list.innerHTML='<div class="card"><strong>Accès restreint</strong><div class="tiny">Ce compte ne peut pas consulter les données disciplinaires.</div></div>';
  return;
 }

 const all=state.discipline||[];
 const q=norm(document.getElementById('disciplineQuery')?.value||'');
 const status=document.getElementById('disciplineStatusFilter')?.value||'';
 const alert=document.getElementById('disciplineAlertFilter')?.value||'';

 const filtered=all.filter(d=>{
  const member=disciplineMemberForCase(d),match=disciplineMatchForCase(d);
  if(q&&!norm([d.personName,d.dossierNumber,d.matchNumber,(d.licenseNumbers||[]).join(' '),d.decision,d.reason,member?.first,member?.last,match?.team,match?.opponent].join(' ')).includes(q))return false;
  const lc=disciplineLifecycle(d);
  if(status && lc.code!==status)return false;
  if(alert==='decision'&&!d.decision)return false;
  if(alert==='red'&&!d.redCard)return false;
  if(alert==='yellow'&&!(Number(d.yellowCards||0)>0))return false;
  if(alert==='unlinked'&&(member||match))return false;
  return true;
 });

 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('discCount',all.length);
 set('discActive',all.filter(d=>disciplineLifecycle(d).code==='active').length);
 set('discFuture',all.filter(d=>disciplineLifecycle(d).code==='future').length);
 set('discClosedOfficial',all.filter(d=>disciplineLifecycle(d).code==='closed_official').length);
 set('discClosedExpired',all.filter(d=>disciplineLifecycle(d).code==='closed_expired').length);
 set('discCheck',all.filter(d=>disciplineLifecycle(d).code==='check').length);
 set('discPeople',new Set(all.map(d=>d.personNumber).filter(Boolean)).size);
 set('discMatches',new Set(all.map(d=>d.matchNumber).filter(Boolean)).size);

 list.innerHTML=filtered.length?filtered.map(d=>{
  const member=disciplineMemberForCase(d),match=disciplineMatchForCase(d);
  const lic=(d.licenseNumbers||[]).join(', ')||member?.licenseNumber||'Non liée';
  const consequences=disciplineConsequences(d);
  const lifecycle=disciplineLifecycle(d);
  const closed=['closed_official','closed_expired'].includes(lifecycle.code);
  const linked=!!member||!!match;
  return `<div class="disc-item ${lifecycle.code==='active'?'disc-alert':''}">
   <strong>${escapeHtml(d.personName||(`${member?.last||''} ${member?.first||''}`.trim())||'Personne')} — dossier ${escapeHtml(d.dossierNumber||'—')}</strong>
   <div class="tiny">${escapeHtml(d.competition||'—')} • Date des faits / match : ${formatDisciplineDate(d.matchDate)}</div>
   <div class="disc-lifecycle">
    <span class="badge ${lifecycle.code==='closed_official'?'green':lifecycle.code==='closed_expired'?'blue':lifecycle.code==='active'?'red':lifecycle.code==='future'?'blue':'yellow'}">${escapeHtml(lifecycle.label)}</span>
    <span class="badge">Effet : ${formatDisciplineDate(d.effectDate)}</span>
    <span class="badge">Fin : ${formatDisciplineDate(d.endDate)}</span>
   </div>
   <div class="disc-date-state tiny">${escapeHtml(lifecycle.reason)}</div>
   ${lifecycle.closureType==='official'?'<div class="tiny" style="margin-top:6px"><strong>Origine de clôture :</strong> décision/statut officiel importé.</div>':lifecycle.closureType==='expired'?'<div class="tiny" style="margin-top:6px"><strong>Origine de clôture :</strong> calcul automatique sur date de fin dépassée.</div>':''}
   ${d.importedStatus?`<div class="tiny" style="margin-top:6px">Statut importé d’origine : <strong>${escapeHtml(d.importedStatus)}</strong></div>`:''}
   <div class="doc-meta" style="margin-top:7px">
    ${d.redCard?'<span class="badge red">Carton rouge enregistré</span>':''}
    ${Number(d.yellowCards||0)>0?`<span class="badge yellow">${Number(d.yellowCards||0)} avertissement(s)</span>`:''}
    <span class="badge">${escapeHtml(d.role||'—')}</span>
    ${lifecycle.code==='active'?'<span class="badge red">EN COURS</span>':lifecycle.code==='future'?'<span class="badge blue">À VENIR</span>':lifecycle.code==='closed_official'?'<span class="badge green">CLOS PAR LA LIGUE</span>':lifecycle.code==='closed_expired'?'<span class="badge blue">CLOS PAR ÉCHÉANCE</span>':'<span class="badge yellow">À CONTRÔLER</span>'}
    ${d.decision?'<span class="badge blue">Décision enregistrée</span>':''}
   </div>
   <p class="tiny">
    <strong>Date des faits / match :</strong> ${formatDisciplineDate(d.matchDate)}<br>
    <strong>Motif :</strong> ${escapeHtml(d.reason||'—')}<br>
    <strong>Décision :</strong> ${escapeHtml(d.decision||'Aucune décision renseignée')}<br>
    <strong>Date d’effet :</strong> ${formatDisciplineDate(d.effectDate)}<br>
    <strong>Date de fin :</strong> ${formatDisciplineDate(d.endDate)}
    ${d.closedAt?`<br><strong>Date de reclassement/clôture automatique :</strong> ${formatDisciplineDateTime(d.closedAt)}`:''}
   </p>
   ${consequences.map(c=>`<div class="consequence ${c.type}"><strong>${c.type==='automatic'?'📄':'⚠️'} ${escapeHtml(c.title)}</strong><div class="tiny">${escapeHtml(c.text)}</div><div class="reg-ref">${escapeHtml(c.ref)}</div></div>`).join('')}
   <div class="disc-link"><span class="badge green">Licence(s) : ${escapeHtml(lic)}</span><span class="badge blue">Match : ${escapeHtml(d.matchNumber||'—')}</span>${match?`<span class="badge">${escapeHtml(matchTeamName(match)||'')} / ${escapeHtml(matchOpponentName(match)||'')}</span>`:''}</div>
   ${!linked?'<div class="disc-data-warning tiny">⚠️ Ce dossier n’est pas complètement rattaché à un licencié ou à un match.</div>':''}
   <div class="disc-actions">
    ${member?`<button class="ghost" onclick="openMemberDetail('${member.id}')">Voir le licencié</button>`:''}
    ${match?`<button class="ghost" onclick="openMatchDetail('${match.id}')">Voir le match</button>`:''}
   </div>
  </div>`;
 }).join(''):'<div class="tiny">Aucun dossier correspondant aux filtres.</div>';
}


let selectedMemberIds=[];
let currentMemberId=null;
let serverMembersState={loaded:false,loading:false,error:'',items:[],total:0,revision:0,requestedAt:0};


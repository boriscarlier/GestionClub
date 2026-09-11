function renderAdminTeams(){
 const root=document.getElementById('intraTeams');if(!root)return;
 if(serverTeamsEnabled()&&!serverTeamsState.loaded&&!serverTeamsState.loading)refreshServerTeams().then(()=>renderAdminTeams());
 updateTeamDataSource();
 const teams=teamSourceRows();

 const groupSelect=document.getElementById('adminTeamGroupFilter');
 if(groupSelect){
  const current=groupSelect.value;
  const groups=[...new Set(teams.map(t=>String(t.group||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'fr'));
  groupSelect.innerHTML='<option value="">Tous les groupes</option>'+groups.map(g=>`<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join('');
  if(groups.includes(current))groupSelect.value=current;
 }

 const q=norm(document.getElementById('adminTeamSearch')?.value||'');
 const group=document.getElementById('adminTeamGroupFilter')?.value||'';
 const filtered=teams.filter(t=>{
  if(group && String(t.group||'')!==group)return false;
  if(q && !norm([t.name,t.competition,t.group,t.coach,t.assistant,t.manager,t.ground].join(' ')).includes(q))return false;
  return true;
 });

 const totalPlayers=teams.reduce((n,t)=>n+teamPlayerCount(t),0);
 const totalMatches=teams.reduce((n,t)=>n+teamMatchCount(t),0);
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('teamCountTotal',teams.length);
 set('teamCountPlayers',totalPlayers);
 set('teamCountMatches',totalMatches);
 set('teamCountPublic',teams.filter(t=>t.public).length);

 const canEdit=currentAdminCan('teams','edit');

 root.innerHTML=filtered.length?filtered.map(t=>{
  const players=teamPlayerCount(t);
  const matches=teamMatchCount(t);
  return `<div class="team-card" onclick="openAdminTeamDetail('${t.id}')">
   <small>${escapeHtml(t.competition||'Compétition non renseignée')}</small>
   <h4>${escapeHtml(t.name||'Équipe')}</h4>
   <p class="tiny">${escapeHtml(t.coach||'Éducateur à renseigner')} • ${escapeHtml(t.ground||'Terrain à renseigner')}</p>
   <div class="team-card-stats">
    <span class="badge">${players} joueur${players>1?'s':''}</span>
    <span class="badge">${matches} match${matches>1?'s':''}</span>
    <span class="badge ${t.public?'green':'yellow'}">${t.public?'Publique':'Interne'}</span>
   </div>
   <div style="margin-top:10px;display:grid;gap:6px">
    <label onclick="event.stopPropagation()" style="${canEdit?'':'opacity:.55'}"><input type="checkbox" ${t.public?'checked':''} ${canEdit?'':'disabled'} onchange="toggleTeamPublic('${t.id}',this.checked)"> Fiche publique</label>
    <label onclick="event.stopPropagation()" style="${canEdit?'':'opacity:.55'}"><input type="checkbox" ${t.rosterPublic?'checked':''} ${canEdit?'':'disabled'} onchange="toggleRosterPublic('${t.id}',this.checked)"> Effectif public</label>
   </div>
  </div>`;
 }).join(''):'<div class="card"><div class="tiny">Aucune équipe correspondant aux filtres.</div></div>';
}



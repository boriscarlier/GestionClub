function renderAdvancedMedia(){
 const grid=document.getElementById('mediaGrid');
 const teamFilter=document.getElementById('mediaTeamFilter');
 const visibilityFilter=document.getElementById('mediaVisibilityFilter');
 const query=document.getElementById('mediaQuery');
 const albumsEl=document.getElementById('albumGrid');
 if(!grid||!teamFilter||!visibilityFilter||!query||!albumsEl)return;

 const currentTeam=teamFilter.value;
 teamFilter.innerHTML='<option value="">Toutes équipes</option>'+[...new Set(state.media.map(m=>m.team))].map(t=>`<option ${currentTeam===t?'selected':''}>${t}</option>`).join('');

 const q=(query.value||'').toLowerCase(),team=teamFilter.value,vis=visibilityFilter.value;
 const filtered=state.media.filter(m=>(m.name+' '+m.team+' '+m.event+' '+m.album).toLowerCase().includes(q)&&(!team||m.team===team)&&(!vis||(vis==='public'?m.public:!m.public)));

 grid.innerHTML=filtered.map(m=>`<div class="media-card ${selectedMediaIds.includes(m.id)?'media-selected':''}" onclick="toggleMediaSelection('${m.id}')"><div class="media-preview">${m.type==='photo'?'📷':'🎥'}</div><div class="media-body"><strong>${m.name}</strong><div class="tiny">${m.season} • ${m.team} • ${m.event}</div><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><span class="badge ${m.public?'green':'yellow'}">${m.public?'Public':'Interne'}</span><span class="badge ${m.rightsOk?'green':'red'}">${m.rightsOk?'Droits OK':'Droits à vérifier'}</span></div></div></div>`).join('');

 const albums=[...new Set(state.media.map(m=>m.album))];
 albumsEl.innerHTML=albums.map(a=>`<div class="album"><strong>📁 ${a}</strong><div class="tiny">${state.media.filter(m=>m.album===a).length} média(s)</div></div>`).join('');
}

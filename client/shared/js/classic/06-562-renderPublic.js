function renderPublic(){
 renderPublicClubIdentity();

 const pubTeams=(state.teams||[]).filter(t=>t.public===true);
 const homeTeams=document.getElementById('publicTeams');
 if(homeTeams){
  homeTeams.innerHTML=pubTeams.map(t=>`<div class="team-card">
   <small>${escapeHtml(t.competition||'')}</small>
   <h4>${escapeHtml(t.name||'Équipe')}</h4>
   <p class="tiny">${publicVisibleMembersForTeam(t).length} joueur(s) public(s)</p>
  </div>`).join('')||'<div class="tiny">Aucune équipe publique pour le moment.</div>';
 }

 renderPublicHomeMatches();
 if(document.getElementById('public-programme')?.classList.contains('active'))renderPublicProgram();

 const published=publicPublishedPosts();
 const main=document.getElementById('publicMainNews');
 if(main)main.textContent=published[0]?.title||'Aucune actualité publiée';

 const side=document.getElementById('publicNewsSide');
 if(side)side.innerHTML=published.slice(1,4).map(p=>`<div class="news-small">
  <span class="badge green">PUBLIÉ</span>
  <h4>${escapeHtml(p.title||'Actualité')}</h4>
  <p class="tiny">${escapeHtml(p.text||'')}</p>
 </div>`).join('');

 const newsMain=document.getElementById('newsPageMain');
 if(newsMain)newsMain.textContent=published[0]?.title||'Aucune actualité publiée';
 const newsSide=document.getElementById('newsPageSide');
 if(newsSide)newsSide.innerHTML=published.slice(1,6).map(p=>`<div class="news-small">
  <span class="badge green">PUBLIÉ</span>
  <h4>${escapeHtml(p.title||'Actualité')}</h4>
  <p class="tiny">${escapeHtml(p.text||'')}</p>
 </div>`).join('');

 const teamGrid=document.getElementById('teamsPageGrid');
 if(teamGrid){
  const filtered=pubTeams.filter(t=>activeTeamFilter==='all'||t.group===activeTeamFilter);
  teamGrid.innerHTML=filtered.map(t=>`<div class="team-card clickable" onclick="openTeamDetail('${t.id}')">
   <small>${escapeHtml(t.competition||'')}</small>
   <h4>${escapeHtml(t.name||'Équipe')}</h4>
   <p class="tiny">${publicVisibleMembersForTeam(t).length} joueur(s) public(s) • ${escapeHtml(t.ground||'Terrain à renseigner')}</p>
   <div style="margin-top:10px"><span class="badge green">Voir la fiche</span></div>
  </div>`).join('')||'<div class="card">Aucune équipe dans cette catégorie.</div>';
 }
 applyClubLogoAssets?.(document);
}

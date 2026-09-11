function renderDashboard(){
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};

 set('statMembers',(state.members||[]).length);
 set('statTeams',(state.teams||[]).length);

 const upcoming=dashboardUpcomingMatches();
 set('dashUpcomingCount',upcoming.length);
 const weekLabel=document.getElementById('dashWeekLabel');
 if(weekLabel)weekLabel.textContent=dashboardWeekLabelText();
 const prevBtn=document.getElementById('dashPrevWeekBtn');
 if(prevBtn)prevBtn.style.display=dashboardWeekOffset>0?'':'none';
 const currentBtn=document.getElementById('dashCurrentWeekBtn');
 if(currentBtn)currentBtn.style.display=dashboardWeekOffset===0?'none':'';

 const matches=document.getElementById('dashMatches');
 if(matches){
  matches.innerHTML=upcoming.length
   ? upcoming.map(m=>{
      const homeAway=typeof matchHomeAwayLabel==='function'?matchHomeAwayLabel(m):'Non renseigné';
      const compType=typeof matchCompetitionType==='function'?matchCompetitionType(m):'Autre';
      const homeAwayBadge=homeAway==='Domicile'
       ? '<span class="badge green">🏠 Domicile</span>'
       : homeAway==='Extérieur'
        ? '<span class="badge blue">✈️ Extérieur</span>'
        : '<span class="badge">— Non renseigné</span>';
      const compBadge=compType==='Coupe'
       ? '<span class="badge yellow">🏆 Coupe</span>'
       : compType==='Championnat'
        ? '<span class="badge green">🏁 Championnat</span>'
        : compType==='Match amical'
         ? '<span class="badge blue">🤝 Match amical</span>'
         : '<span class="badge">Autre</span>';
      return `<div class="match-card" onclick="openMatchDetail('${m.id}')" style="cursor:pointer">
       <strong>${escapeHtml(m.team||'CLUB EXEMPLE')} — ${escapeHtml(m.opponent||m.opponentClub||'Adversaire')}</strong>
       <div class="dash-match-meta">${homeAwayBadge}${compBadge}</div>
       <div class="tiny">${typeof formatMatchDateFr==='function'?formatMatchDateFr(m.date):escapeHtml(m.date||'')} • ${escapeHtml(m.time||'Horaire à préciser')} • ${escapeHtml(m.place||'Lieu à préciser')}</div>
      </div>`;
     }).join('')
   : '<div class="tiny">Aucun match à venir sur la semaine affichée.</div>';
 }

 const posts=document.getElementById('dashPosts');
 if(posts){
  const recent=[...(state.posts||[])].slice(0,4);
  posts.innerHTML=recent.length
   ? recent.map(p=>`<div class="match-card">
      <strong>${escapeHtml(p.title||'Publication')}</strong>
      <div class="tiny">${escapeHtml(qaChannels(p).join(' • ')||p.status||'')}</div>
     </div>`).join('')
   : '<div class="tiny">Aucune publication récente.</div>';
 }

 const health=document.getElementById('dashDataHealth');
 if(health){
  const types=['members','matches','discipline','opponents'];
  health.innerHTML=types.map(type=>{
   const defs=(typeof IMPORT_SOURCE_DEFS!=='undefined'&&IMPORT_SOURCE_DEFS)?IMPORT_SOURCE_DEFS:{};
   const def=defs[type]||{label:type,icon:'📦'};
   const st=typeof importFreshnessState==='function'?importFreshnessState(type):{status:'stale',label:'À vérifier'};
   const badge=st.status==='ok'?'green':st.status==='warn'?'yellow':'red';
   const label=st.status==='ok'?'À jour':(st.label||'À vérifier');
   return `<div class="stats-health-row"><span>${def.icon||'📦'} ${escapeHtml(def.label||type)}</span><span class="badge ${badge}">${escapeHtml(label)}</span></div>`;
  }).join('');
 }
 if(typeof renderDashboardSportHealth==='function')renderDashboardSportHealth();
}



function renderDashboardSportHealth(){
 const root=document.getElementById('dashPresenceRate');if(!root)return;
 const d=dashboardSportHealthData();
 const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
 set('dashPresenceRate',d.presenceRate===null?'—':d.presenceRate+' %');
 set('dashPresenceMeta',`${d.sessions} séance${d.sessions>1?'s':''} enregistrée${d.sessions>1?'s':''}`);
 set('dashInjuredPlayers',d.injuredPlayers);
 set('dashLineupFillRate',d.lineupFillRate===null?'—':d.lineupFillRate+' %');
 set('dashLineupMeta',`${d.withLineup}/${d.finishedMatches} match(s) terminé(s) avec composition`);
 set('dashMatchesToRegularize',d.toRegularize);
 set('dashPresentCount',d.present);
 set('dashAbsentCount',d.absent);
 set('dashExcusedCount',d.excused);
 set('dashTrainingInjuredCount',d.injuredAttendance);

 const max=Math.max(1,d.present,d.absent,d.excused,d.injuredAttendance);
 const widths={
  dashBarPresent:d.present/max*100,
  dashBarAbsent:d.absent/max*100,
  dashBarExcused:d.excused/max*100,
  dashBarInjured:d.injuredAttendance/max*100
 };
 Object.entries(widths).forEach(([id,w])=>{
  const el=document.getElementById(id);if(el)el.style.width=Math.max(0,Math.min(100,w))+'%';
 });

 const table=document.getElementById('dashTeamPresenceTable');
 if(table){
  table.innerHTML=d.teamRows.length?`<table><thead><tr><th>Équipe</th><th>Séances</th><th>Présents</th><th>Absents</th><th>Excusés</th><th>Blessés</th><th>Taux</th></tr></thead><tbody>${d.teamRows.map(r=>`<tr><td>${escapeHtml(r.team)}</td><td>${r.sessions}</td><td>${r.present}</td><td>${r.absent}</td><td>${r.excused}</td><td>${r.injured}</td><td>${r.rate===null?'—':r.rate+' %'}</td></tr>`).join('')}</tbody></table>`:'<div class="tiny">Aucune donnée de présence disponible.</div>';
 }
}


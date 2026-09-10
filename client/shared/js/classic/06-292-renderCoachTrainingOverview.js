function renderCoachTrainingOverview(){
 const sessions=coachTeamTrainings();
 const allStatuses=sessions.flatMap(s=>[...new Set(s.playerIds||[])].map(id=>s.attendance?.[id]||'pending'));
 const present=allStatuses.filter(x=>x==='present').length;
 const absent=allStatuses.filter(x=>x==='absent').length;
 const excused=allStatuses.filter(x=>x==='excused').length;
 const injured=allStatuses.filter(x=>x==='injured').length;
 const decided=present+absent+excused+injured;
 const rate=decided?Math.round((present/decided)*100):null;

 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
 set('coachTrainingSessionCount',sessions.length);
 set('coachTrainingPresenceCount',present);
 set('coachTrainingAbsenceCount',absent);
 set('coachTrainingRate',rate===null?'—':rate+' %');

 const list=document.getElementById('coachTrainingList');
 if(list){
  list.innerHTML=sessions.map(s=>{
   const statuses=[...new Set(s.playerIds||[])].map(id=>s.attendance?.[id]||'pending');
   const p=statuses.filter(x=>x==='present').length;
   const a=statuses.filter(x=>x==='absent').length;
   const e=statuses.filter(x=>x==='excused').length;
   const i=statuses.filter(x=>x==='injured').length;
   const pending=statuses.filter(x=>x==='pending').length;
   return `<div class="coach-training-session">
    <div><strong>${escapeHtml(s.title||'Entraînement')}</strong> <span class="badge blue">${escapeHtml(s.team||'')}</span></div>
    <div class="tiny">${formatMatchDateFr(s.date)} • ${escapeHtml(s.time||'—')} • ${escapeHtml(s.place||'—')}</div>
    <div class="tiny">Présents ${p} • Absents ${a} • Excusés ${e} • Blessés ${i} • À renseigner ${pending}</div>
    <div class="actions" style="margin-top:7px"><button class="ghost" onclick="coachOpenTrainingSession('${s.id}')">Fiche de présence</button><button class="ghost" onclick="coachDeleteTrainingSession('${s.id}')">Supprimer</button></div>
   </div>`;
  }).join('')||'<div class="tiny">Aucune séance créée pour cette équipe.</div>';
 }

 const players=coachTeamMembers();
 const stats=document.getElementById('coachTrainingPlayerStats');
 if(stats){
  stats.innerHTML=players.length?`<table><thead><tr><th>Joueur</th><th>Séances</th><th>Présent</th><th>Absent</th><th>Excusé</th><th>Blessé</th><th>Taux</th></tr></thead><tbody>${players.map(p=>{
   const st=coachTrainingAttendanceStats(p.id);
   return `<tr><td>${escapeHtml((p.last||'')+' '+(p.first||''))}</td><td>${st.sessions}</td><td>${st.present}</td><td>${st.absent}</td><td>${st.excused}</td><td>${st.injured}</td><td>${st.rate===null?'—':st.rate+' %'}</td></tr>`;
  }).join('')}</tbody></table>`:'<div class="tiny">Aucun joueur dans cette équipe.</div>';
 }
}

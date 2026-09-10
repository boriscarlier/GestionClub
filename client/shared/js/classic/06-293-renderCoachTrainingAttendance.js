function renderCoachTrainingAttendance(){
 const panel=document.getElementById('coachTrainingAttendancePanel');if(!panel)return;
 let s=coachTrainingSessionById(coachCurrentTrainingSessionId);
 if(!s||norm(s.team)!==norm(coachCurrentTeamName)){
  s=coachTeamTrainings()[0]||null;
  coachCurrentTrainingSessionId=s?.id||null;
 }
 if(!s){panel.innerHTML='';return;}

 const currentPlayers=coachTeamMembers();
 const players=(s.playerIds||[]).map(id=>(state.members||[]).find(m=>m.id===id)||s.playerSnapshots?.[id]||{id,last:'Joueur archivé',first:'',personNumber:id}).filter(Boolean);
 panel.innerHTML=`<div class="coach-card">
  <h4>Fiche de présence — ${escapeHtml(s.title||'Entraînement')}</h4>
  <div class="tiny">${formatMatchDateFr(s.date)} • ${escapeHtml(s.time||'—')} • ${escapeHtml(s.place||'—')} • ${escapeHtml(s.team||'')}</div>
  <div style="margin-top:10px">${players.map(p=>{
   const st=s.attendance?.[p.id]||'pending';
   return `<div class="coach-attendance-row">
    <div><strong>${escapeHtml((p.last||'')+' '+(p.first||''))}</strong><div class="tiny">Licence ${escapeHtml(p.personNumber||'—')}</div></div>
    <span class="badge ${st==='present'?'green':st==='absent'?'red':st==='excused'?'blue':st==='injured'?'yellow':'yellow'}">${st==='present'?'PRÉSENT':st==='absent'?'ABSENT':st==='excused'?'EXCUSÉ':st==='injured'?'BLESSÉ':'À RENSEIGNER'}</span>
    <div class="coach-attendance-actions">
     <button class="ghost" onclick="coachSetTrainingAttendance('${s.id}','${p.id}','pending')">À renseigner</button>
     <button class="ghost ${st==='present'?'active':''}" onclick="coachSetTrainingAttendance('${s.id}','${p.id}','present')">Présent</button>
     <button class="ghost ${st==='absent'?'active':''}" onclick="coachSetTrainingAttendance('${s.id}','${p.id}','absent')">Absent</button>
     <button class="ghost ${st==='excused'?'active':''}" onclick="coachSetTrainingAttendance('${s.id}','${p.id}','excused')">Excusé</button>
     <button class="ghost ${st==='injured'?'active':''}" onclick="coachSetTrainingAttendance('${s.id}','${p.id}','injured')">Blessé</button>
    </div>
   </div>`;
  }).join('')||'<div class="tiny">Aucun joueur dans cette fiche de présence.</div>'}</div>
 </div>`;
}


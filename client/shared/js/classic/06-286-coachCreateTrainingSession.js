function coachCreateTrainingSession(){
 if(!qaCoachScope())return toast('Accès refusé','Équipe non autorisée.');
 const title=String(document.getElementById('coachTrainingTitle')?.value||'Entraînement').trim()||'Entraînement';
 const date=String(document.getElementById('coachTrainingDate')?.value||'').trim();
 const time=String(document.getElementById('coachTrainingTime')?.value||'').trim();
 const place=String(document.getElementById('coachTrainingPlace')?.value||'').trim();
 if(!date||!parseDateSafe(date)){toast('Entraînement','La date est obligatoire.');return;}
 if(!coachCurrentTeamName){toast('Entraînement','Aucune équipe active.');return;}

 if(time&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))return toast('Entraînement','Heure invalide.');
 const players=coachTeamMembers();
 const session={
  id:uid('tr'),team:coachCurrentTeamName,title,date,time,place,
  playerIds:players.map(p=>p.id),
  playerSnapshots:Object.fromEntries(players.map(p=>[p.id,{id:p.id,first:p.first||'',last:p.last||'',personNumber:p.personNumber||''}])),
  attendance:{},
  createdAt:new Date().toISOString(),
  createdBy:coachCurrentMemberId||'',
  updatedAt:new Date().toISOString()
 };
 players.forEach(p=>session.attendance[p.id]='pending');
 if(!state.coachTrainingSessions)state.coachTrainingSessions=[];
 state.coachTrainingSessions.push(session);
 coachCurrentTrainingSessionId=session.id;
 localStorage.setItem(KEY,JSON.stringify(state));
 if(typeof logAdminAction==='function')logAdminAction('Portail éducateurs','Création entraînement',`${coachCurrentTeamName} • ${date} • ${title}`);
 coachCurrentPage='training';
 renderCoachPortal();
 toast('Entraînement','Séance créée. La fiche de présence est prête.');
}

function coachSetTrainingAttendance(sessionId,memberId,status){
 const s=coachTrainingSessionById(sessionId);
 if(!qaTrainingAccess(s)||!(s.playerIds||[]).includes(memberId))return toast('Accès refusé','Séance ou joueur hors périmètre.');
 if(!['present','absent','excused','injured','pending'].includes(status))return false;
 const before=JSON.parse(JSON.stringify(s));s.attendance=s.attendance||{};s.attendance[memberId]=status;s.updatedAt=new Date().toISOString();s.updatedBy=coachCurrentMemberId;
 try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){Object.assign(s,before);toast('Non enregistré','La présence n’a pas été sauvegardée.');return false;}
 logAdminAction('Portail éducateurs','Présence entraînement',`${s.team} • ${s.date} • ${status}`);
 renderCoachTrainingAttendance();renderCoachTrainingOverview();renderCoachPlayerStats();return true;
}

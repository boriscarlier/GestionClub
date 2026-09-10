function setCoachFmiPrepared(matchId,prepared){
 const allowed=coachTeamMatches().some(m=>m.id===matchId&&!coachMatchPlayed(m));
 if(!allowed){toast('FMI','Match hors périmètre.');return;}
 const box=coachFmiState();
 box[matchId]={
  prepared:!!prepared,
  updatedAt:new Date().toISOString(),
  updatedBy:coachCurrentMemberId||'',
  team:coachCurrentTeamName||''
 };
 localStorage.setItem(KEY,JSON.stringify(state));
 if(typeof logAdminAction==='function'){
  logAdminAction('Portail éducateurs','Préparation FMI',`${coachCurrentTeamName} • ${matchId} • ${prepared?'effectuée':'à refaire'}`);
 }
 renderCoachLineup();
}

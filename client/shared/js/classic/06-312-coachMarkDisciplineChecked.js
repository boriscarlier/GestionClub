function coachMarkDisciplineChecked(memberId){
 const player=coachTeamMembers().find(m=>m.id===memberId);
 if(!player){
  toast('Portail éducateurs','Joueur hors périmètre.');
  return;
 }

 const issues=coachDisciplineIssuesForPlayer(player);
 if(!issues.length){
  toast('Discipline','Aucune situation disciplinaire à vérifier.');
  return;
 }

 let changed=0;
 issues.forEach(issue=>{
  const review=regulatoryReviewForIssue(issue);
  if(review.status==='pending'){
   const key=regulatoryReviewKey(issue);
   if(!state.regulatoryReviewState)state.regulatoryReviewState={};
   state.regulatoryReviewState[key]={
    ...review,
    status:'checked',
    checkedByCoachId:coachCurrentMemberId||'',
    checkedByCoachTeam:coachCurrentTeamName||'',
    updatedAt:new Date().toISOString()
   };
   changed++;
  }
 });

 if(!changed){
  toast('Discipline','Cette situation a déjà été vérifiée ou traitée.');
  return;
 }

 localStorage.setItem(KEY,JSON.stringify(state));
 if(typeof logAdminAction==='function'){
  logAdminAction('Portail éducateurs','Vérification disciplinaire',`${coachCurrentTeamName} • ${player.last||''} ${player.first||''} • ${changed} situation(s) vérifiée(s)`);
 }
 renderCoachPortal();
 if(typeof renderRegulatoryChecks==='function')renderRegulatoryChecks();
 toast('Discipline','Situation disciplinaire marquée vérifiée.');
}

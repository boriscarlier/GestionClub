function coachDisciplineReviewState(player){
 const issues=coachDisciplineIssuesForPlayer(player);
 if(!issues.length)return {status:'none',label:'Aucune situation disciplinaire',issues:[]};

 const enriched=issues.map(issue=>({
  issue,
  review:regulatoryReviewForIssue(issue)
 }));

 if(enriched.some(x=>x.issue.severity==='block' && !['validated','closed'].includes(x.review.status))){
  return {status:'blocked',label:'Situation disciplinaire active',issues:enriched};
 }
 if(enriched.some(x=>x.review.status==='pending')){
  return {status:'pending',label:'Situation disciplinaire à vérifier',issues:enriched};
 }
 if(enriched.some(x=>x.review.status==='checked')){
  return {status:'checked',label:'Situation disciplinaire vérifiée',issues:enriched};
 }
 return {status:'resolved',label:'Situation disciplinaire traitée',issues:enriched};
}

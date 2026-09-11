function closeExpiredRegulatoryReviews(){
 let changed=false;
 allRegulatoryIssues().forEach(issue=>{
  const ds=regulatoryIssueDateState(issue);
  if(!ds.expired)return;
  const key=regulatoryReviewKey(issue);
  const current=(state.regulatoryReviewState||{})[key]||{};
  if(!['validated','closed'].includes(current.status)){
   if(!state.regulatoryReviewState)state.regulatoryReviewState={};
   state.regulatoryReviewState[key]={...current,status:'closed',updatedAt:new Date().toISOString(),autoClosed:true};
   changed=true;
  }
 });
 if(changed)localStorage.setItem(KEY,JSON.stringify(state));
}


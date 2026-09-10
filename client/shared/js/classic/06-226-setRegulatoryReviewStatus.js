function setRegulatoryReviewStatus(memberId,kind,title,status){
 if(!state.regulatoryReviewState)state.regulatoryReviewState={};
 const key=`${memberId||''}|${kind||''}|${title||''}`;
 const current=state.regulatoryReviewState[key]||{};
 state.regulatoryReviewState[key]={
  ...current,
  status,
  updatedAt:new Date().toISOString()
 };
 localStorage.setItem(KEY,JSON.stringify(state));
 renderRegulatoryChecks();
}

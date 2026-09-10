function setRegulatoryReviewNote(memberId,kind,title,note){
 if(!state.regulatoryReviewState)state.regulatoryReviewState={};
 const key=`${memberId||''}|${kind||''}|${title||''}`;
 const current=state.regulatoryReviewState[key]||{status:'pending'};
 state.regulatoryReviewState[key]={
  ...current,
  note:String(note||'').trim(),
  updatedAt:new Date().toISOString()
 };
 localStorage.setItem(KEY,JSON.stringify(state));
}

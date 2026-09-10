function regulatoryReviewForIssue(issue){
 const key=regulatoryReviewKey(issue);
 return (state.regulatoryReviewState||{})[key]||{status:'pending',note:'',updatedAt:''};
}

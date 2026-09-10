function matchIsUpcoming(m){
 return !matchIsFinished(m) && !norm(matchStatusValue(m)).includes('annul');
}

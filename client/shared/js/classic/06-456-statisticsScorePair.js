function statisticsScorePair(m){
 if(!matchIsFinished(m))return null;
 const score=matchDisplayScores(m);
 return Number.isFinite(score.fc)&&Number.isFinite(score.opp)?{fc:score.fc,opp:score.opp}:null;
}



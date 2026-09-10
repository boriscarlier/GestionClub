function publicMatchScoreText(m){
 if(!hasMatchScore(m))return '';
 const sc=matchDisplayScores(m);
 return `${sc.fc} - ${sc.opp}`;
}

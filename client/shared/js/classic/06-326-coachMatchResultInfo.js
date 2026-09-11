function coachMatchResultInfo(match){
 const score=matchDisplayScores(match);
 if(!Number.isFinite(score.fc)||!Number.isFinite(score.opp))return {has:false,label:hasMatchScore(match)?'Résultat à orienter':'Résultat non renseigné',className:'yellow',scoreText:'—'};
 return {has:true,label:score.fc>score.opp?'Victoire':score.fc<score.opp?'Défaite':'Match nul',className:score.fc>score.opp?'green':score.fc<score.opp?'red':'blue',scoreText:`${score.fc} - ${score.opp}`};
}

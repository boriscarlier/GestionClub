function coachPlayerStatSummary(player){
 const train=coachTrainingAttendanceStats(player.id);
 const matchHistory=coachPlayerMatchHistory(player.id);
 const matchesPlayed=matchHistory.filter(x=>x.played).length;
 const discipline=coachDisciplineReviewState(player);
 const sport=coachPlayerStatus(player);
 return {train,matchHistory,matchesPlayed,discipline,sport};
}

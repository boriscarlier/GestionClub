function coachPlayerTrainingHistory(memberId){
 return (state.coachTrainingSessions||[])
  .filter(s=>norm(s.team)===norm(coachCurrentTeamName)&&(s.playerIds||[]).includes(memberId))
  .map(s=>({
   id:s.id,date:s.date||'',title:s.title||'Entraînement',time:s.time||'',
   place:s.place||'',status:s.attendance?.[memberId]||'pending'
  }))
  .sort((a,b)=>String(b.date).localeCompare(String(a.date)));
}

function coachTrainingSessionById(id){
 return (state.coachTrainingSessions||[]).find(s=>s.id===id)||null;
}

function coachTrainingAttendanceStats(id){return qaTrainingCounts((state.coachTrainingSessions||[]).filter(s=>norm(s.team)===norm(coachCurrentTeamName)),id);}

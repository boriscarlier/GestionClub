function coachMatchIsClosedForCoach(match){
 return coachMatchPlayed(match) && coachLineupExistsForMatch(match.id);
}


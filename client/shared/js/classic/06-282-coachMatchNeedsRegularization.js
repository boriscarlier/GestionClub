function coachMatchNeedsRegularization(match){
 return coachMatchPlayed(match) && !coachLineupExistsForMatch(match.id);
}

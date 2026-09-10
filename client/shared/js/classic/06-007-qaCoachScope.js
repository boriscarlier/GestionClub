function qaCoachScope(team=coachCurrentTeamName){
 const m=coachMember();return !!m&&!!team&&coachEligibleTeams(m).some(t=>norm(t)===norm(team));
}


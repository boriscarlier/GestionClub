function qaOpenLineup(matchId){
 if(!qaCoachMatchesAll().some(m=>m.id===matchId))return false;
 qaSyncMatchSelectors();document.getElementById('coachLineupMatch').value=matchId;coachGo('lineup');renderCoachLineup();return true;
}


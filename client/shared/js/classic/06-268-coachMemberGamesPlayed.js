function coachMemberGamesPlayed(memberId){
 return Object.entries(coachLineups||{}).filter(([id,r])=>{const players=Array.isArray(r)?r:r?.players;return Array.isArray(players)&&players.includes(memberId)&&coachLineupExistsForMatch(id)&&coachMatchPlayed((state.matches||[]).find(m=>m.id===id));}).length;
}

function coachLineupRecord(matchId){
 if(!matchId)return {players:[],status:'draft'};
 const raw=coachLineups?.[matchId],match=(state.matches||[]).find(m=>m.id===matchId);
 if(Array.isArray(raw))coachLineups[matchId]={players:[...new Set(raw)],status:raw.length?'final':'draft',team:match?.team||'',matchId,updatedAt:''};
 if(!coachLineups[matchId])coachLineups[matchId]={players:[],status:'draft',team:match?.team||coachCurrentTeamName||'',matchId};
 const rec=coachLineups[matchId];if(!Array.isArray(rec.players))rec.players=[];return rec;
}

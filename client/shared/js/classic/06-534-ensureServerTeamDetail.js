async function ensureServerTeamDetail(id){
 if(!serverTeamsEnabled())return null;
 const current=(state.teams||[]).find(t=>t.id===id&&t.sourcePayloadLoaded);
 if(current)return current;
 const data=await serverTeamsApi('/api/state/teams/'+encodeURIComponent(id));
 const payload=data.team?.payload||data.team;
 if(!payload||!payload.id)return null;
 payload.sourcePayloadLoaded=true;
 const idx=(state.teams||[]).findIndex(t=>t.id===payload.id);
 if(idx>=0)state.teams[idx]={...state.teams[idx],...payload};
 else state.teams.push(payload);
 return payload;
}

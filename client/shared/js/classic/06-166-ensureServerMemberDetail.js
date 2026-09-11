async function ensureServerMemberDetail(id){
 if(!serverMembersEnabled())return null;
 const current=(state.members||[]).find(m=>m.id===id&&m.sourcePayloadLoaded);
 if(current)return current;
 const data=await serverMembersApi('/api/state/members/'+encodeURIComponent(id));
 const payload=data.member?.payload||data.member;
 if(!payload||!payload.id)return null;
 payload.sourcePayloadLoaded=true;
 const idx=(state.members||[]).findIndex(m=>m.id===payload.id);
 if(idx>=0)state.members[idx]={...state.members[idx],...payload};
 else state.members.push(payload);
 return payload;
}


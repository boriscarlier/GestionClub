function memberPortalOwnRecordIds(member){
 if(!member)return new Set();
 const ids=new Set([member.id]);
 if(member.personNumber){
  (state.members||[]).forEach(m=>{if(m.personNumber===member.personNumber)ids.add(m.id)});
 }
 return ids;
}

let portalCurrentMemberId=null;


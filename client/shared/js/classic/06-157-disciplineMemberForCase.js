function disciplineMemberForCase(d){
 if(Array.isArray(d.memberIds)&&d.memberIds.length){
  const found=(state.members||[]).find(m=>d.memberIds.includes(m.id));if(found)return found;
 }
 if(d.personNumber)return (state.members||[]).find(m=>norm(m.personNumber||'')===norm(d.personNumber||''))||null;
 const licenses=d.licenseNumbers||[];
 return (state.members||[]).find(m=>licenses.includes(m.licenseNumber))||null;
}

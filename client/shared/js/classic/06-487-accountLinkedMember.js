function accountLinkedMember(a){
 if(!a?.memberId)return null;
 return (state.members||[]).find(m=>m.id===a.memberId)||null;
}

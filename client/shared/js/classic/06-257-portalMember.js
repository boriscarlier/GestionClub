function portalMember(){
 return (state.members||[]).find(x=>x.id===portalCurrentMemberId)||null;
}

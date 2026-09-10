function accountLinkedToMember(member){
 if(!member)return null;
 return (state.accounts||[]).find(a=>a.memberId===member.id && a.status!=='disabled')||null;
}

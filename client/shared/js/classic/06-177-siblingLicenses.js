function siblingLicenses(member){
 if(!member)return [];
 const person=String(member.personNumber??'').trim();
 return (state.members||[]).filter(m=>m.id===member.id||(person&&String(m.personNumber??'').trim()===person));
}

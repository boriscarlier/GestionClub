function disciplineForMember(member){
 if(!member)return [];
 const person=String(member.personNumber??'').trim(),licence=String(member.licenseNumber??'').trim();
 return (state.discipline||[]).filter(d=>
  (member.id&&Array.isArray(d.memberIds)&&d.memberIds.includes(member.id))||
  (person&&String(d.personNumber||d.personId||'').trim()===person)||
  (licence&&String(d.licenseNumber||'').trim()===licence));
}

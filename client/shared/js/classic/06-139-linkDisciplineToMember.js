function linkDisciplineToMember(rec){
 const pn=norm(rec.personNumber);
 const candidates=(state.members||[]).filter(m=>norm(m.personNumber)===pn);
 rec.memberIds=candidates.map(m=>m.id);
 rec.licenseNumbers=[...new Set(candidates.map(m=>String(m.licenseNumber||'').trim()).filter(Boolean))];
 rec.primaryMemberId=rec.memberIds[0]||null;
 return rec;
}

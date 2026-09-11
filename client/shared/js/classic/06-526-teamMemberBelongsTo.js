function teamMemberBelongsTo(member,team){
 const names=[member.category,member.subcategory,member.team].map(v=>norm(v||'')).filter(Boolean);
 return names.includes(norm(team.name||''));
}

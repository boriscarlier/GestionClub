function memberIsFemale(m){
 const vals=[m.sex,m.gender,m.sexe,m.category,m.team,m.categoryLabel]
  .map(v=>norm(v||'')).filter(Boolean);
 return vals.some(v=>v==='f'||v.includes('feminin')||v.includes('féminin')||v.includes('female'));
}


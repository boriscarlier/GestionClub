function publicMatchSection(m){
 const team=(state.teams||[]).find(t=>norm(t.name)===norm(m.team));
 if(team && team.group)return String(team.group);
 const n=norm(m.team||'');
 if(n.includes('feminin'))return 'feminines';
 if(/^u\d+/.test(n))return 'jeunes';
 if(n.includes('senior')||n.includes('veteran'))return 'seniors';
 return 'autres';
}

function publicSectionLabel(value){
 const map={
  seniors:'Seniors',
  feminines:'Féminines',
  jeunes:'Jeunes',
  autres:'Autres'
 };
 const teamGroup=(state.teams||[]).find(t=>String(t.group||'')===value)?.group;
 if(map[value])return map[value];
 if(teamGroup)return teamGroup.charAt(0).toUpperCase()+teamGroup.slice(1);
 return value||'Toutes les sections';
}

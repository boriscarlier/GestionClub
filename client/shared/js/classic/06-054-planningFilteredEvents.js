function planningFilteredEvents(){
 const q=norm(document.getElementById('planningSearch')?.value||'');
 const team=document.getElementById('planningTeamFilter')?.value||'';
 const type=document.getElementById('planningTypeFilter')?.value||'';
 return (state.planning||[]).filter(e=>{
  if(q&&!norm([e.title,e.team,e.place,e.type].join(' ')).includes(q))return false;
  if(team&&String(e.team||'')!==team)return false;
  if(type&&String(e.type||'')!==type)return false;
  return true;
 });
}

function filteredMatchesForAdmin(){
 const q=norm(document.getElementById('matchSearch')?.value||'');
 const team=document.getElementById('matchTeamFilter')?.value||'';
 const competitionType=document.getElementById('matchCompetitionTypeFilter')?.value||'';
 const homeAway=document.getElementById('matchHomeAwayFilter')?.value||'';
 const sort=document.getElementById('matchSort')?.value||'date-asc';

 let arr=(state.matches||[]).filter(m=>{
  if(q && !matchSearchText(m).includes(q))return false;
  if(team && matchTeamName(m)!==team)return false;
  if(competitionType && matchCompetitionType(m)!==competitionType)return false;
  if(homeAway && matchHomeAwayLabel(m)!==homeAway)return false;
  if(matchStatusFilter && matchStatusValue(m)!==matchStatusFilter)return false;
  return true;
 });

 arr.sort((a,b)=>{
  if(sort==='date-desc')return String(b.date||'').localeCompare(String(a.date||''));
  if(sort==='team')return String(a.team||'').localeCompare(String(b.team||''),'fr');
  if(sort==='opponent')return String(a.opponent||'').localeCompare(String(b.opponent||''),'fr');
  if(sort==='status')return matchStatusValue(a).localeCompare(matchStatusValue(b),'fr');
  return String(a.date||'').localeCompare(String(b.date||''));
 });
 return arr;
}

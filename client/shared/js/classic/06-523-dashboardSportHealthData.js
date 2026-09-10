function dashboardSportHealthData(){
 if((!coachLineups||!Object.keys(coachLineups).length)){
  try{coachLineups=JSON.parse(localStorage.getItem('fclc_coach_lineups')||'{}')}catch(e){coachLineups={}}
 }
 const sessions=state.coachTrainingSessions||[];
 const attendanceValues=sessions.flatMap(s=>[...new Set(s.playerIds||[])].map(id=>s.attendance?.[id]||'pending'));
 const present=attendanceValues.filter(x=>x==='present').length;
 const absent=attendanceValues.filter(x=>x==='absent').length;
 const excused=attendanceValues.filter(x=>x==='excused').length;
 const injuredAttendance=attendanceValues.filter(x=>x==='injured').length;
 const decided=present+absent+excused+injuredAttendance;
 const presenceRate=decided?Math.round((present/decided)*100):null;

 const injuredPlayers=(state.members||[]).filter(m=>state.coachPlayerAvailability?.[m.id]?.status==='injured').length;

 const allMatches=state.matches||[];
 const finished=allMatches.filter(m=>typeof matchIsFinished==='function'?matchIsFinished(m):norm(m.status||'').includes('termin'));
 const withLineup=finished.filter(m=>{
  const raw=coachLineups?.[m.id];
  return Array.isArray(raw)?raw.length>0:!!(raw&&Array.isArray(raw.players)&&raw.players.length>0);
 });
 const toRegularize=finished.length-withLineup.length;
 const lineupFillRate=finished.length?Math.round((withLineup.length/finished.length)*100):null;

 const teamRows=(state.teams||[]).map(t=>{
  const ts=sessions.filter(s=>norm(s.team)===norm(t.name));
  const vals=ts.flatMap(s=>[...new Set(s.playerIds||[])].map(id=>s.attendance?.[id]||'pending'));
  const p=vals.filter(x=>x==='present').length;
  const a=vals.filter(x=>x==='absent').length;
  const e=vals.filter(x=>x==='excused').length;
  const i=vals.filter(x=>x==='injured').length;
  const d=p+a+e+i;
  return {team:t.name,sessions:ts.length,present:p,absent:a,excused:e,injured:i,rate:d?Math.round((p/d)*100):null};
 }).filter(r=>r.sessions>0);

 return {
  sessions:sessions.length,present,absent,excused,injuredAttendance,
  decided,presenceRate,injuredPlayers,
  finishedMatches:finished.length,withLineup:withLineup.length,toRegularize,lineupFillRate,
  teamRows
 };
}

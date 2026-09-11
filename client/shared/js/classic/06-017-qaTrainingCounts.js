function qaTrainingCounts(sessions,memberId=null){
 const counts={sessions:0,present:0,absent:0,excused:0,injured:0,pending:0};
 for(const s of sessions){
  if(s.cancelled||s.status==='cancelled')continue;
  const ids=[...new Set(s.playerIds||[])];if(memberId!==null&&!ids.includes(memberId))continue;
  counts.sessions++;
  for(const id of memberId===null?ids:[memberId]){
   const status=s.attendance?.[id]||'pending';counts[['present','absent','excused','injured'].includes(status)?status:'pending']++;
  }
 }
 const decided=counts.present+counts.absent+counts.excused+counts.injured;
 return {...counts,decided,rate:decided?Math.round(100*counts.present/decided):null};
}


function dashboardUpcomingMatches(){
 const {start,end}=dashboardWeekWindow();
 return (state.matches||[])
  .filter(m=>{
   const d=parseDashboardMatchDate(m.date);
   if(!d)return false;

   const finished=(typeof publicMatchIsFinished==='function')
    ? publicMatchIsFinished(m)
    : ((typeof hasMatchScore==='function'&&hasMatchScore(m)) || norm(m.status||'').includes('termin'));

   return !finished && d>=start && d<=end;
  })
  .sort((a,b)=>{
   const da=parseDashboardMatchDate(a.date),db=parseDashboardMatchDate(b.date);
   const ta=String(a.time||'00:00'),tb=String(b.time||'00:00');
   return (da-db) || ta.localeCompare(tb);
  });
}



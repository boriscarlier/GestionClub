function dashboardWeekWindow(offset=dashboardWeekOffset){
 const now=new Date();
 now.setHours(0,0,0,0);
 const day=(now.getDay()+6)%7;
 const start=new Date(now);
 start.setDate(now.getDate()-day+(Number(offset)||0)*7);
 start.setHours(0,0,0,0);
 const end=new Date(start);
 end.setDate(start.getDate()+6);
 end.setHours(23,59,59,999);
 return {start,end};
}

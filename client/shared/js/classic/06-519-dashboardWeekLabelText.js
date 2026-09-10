function dashboardWeekLabelText(){
 const {start,end}=dashboardWeekWindow();
 const fmt=new Intl.DateTimeFormat('fr-FR',{day:'2-digit',month:'2-digit'});
 const prefix=dashboardWeekOffset===0?'Semaine en cours':
  dashboardWeekOffset===1?'Semaine suivante':
  dashboardWeekOffset===-1?'Semaine précédente':
  `Semaine ${dashboardWeekOffset>0?'+':''}${dashboardWeekOffset}`;
 return `${prefix} • ${fmt.format(start)} → ${fmt.format(end)}`;
}

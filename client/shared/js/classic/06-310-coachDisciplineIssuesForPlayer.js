function coachDisciplineIssuesForPlayer(player){
 return regulatoryIssuesForMember(player).filter(i=>i.kind==='discipline');
}

function coachAttendanceBadge(status){
 return status==='present'?'green':status==='absent'?'red':status==='excused'?'blue':status==='injured'?'yellow':'yellow';
}

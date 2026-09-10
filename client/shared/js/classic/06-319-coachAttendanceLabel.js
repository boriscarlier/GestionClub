function coachAttendanceLabel(status){
 return status==='present'?'Présent':status==='absent'?'Absent':status==='excused'?'Excusé':status==='injured'?'Blessé':'À renseigner';
}

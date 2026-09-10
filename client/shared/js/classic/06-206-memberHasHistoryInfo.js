function memberHasHistoryInfo(m){
 return !![
  m.clubName,m.clubNumber,m.requestNature,m.clubChangeNature,m.formerClub,m.formerClubSeason,
  m.registrationDate,m.licenseIssueDate,m.nextStatus
 ].some(v=>String(v??'').trim()!=='');
}

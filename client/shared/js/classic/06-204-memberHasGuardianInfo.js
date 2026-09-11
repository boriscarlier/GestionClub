function memberHasGuardianInfo(m){
 return !![
  m.guardian1Name,m.guardianName,m.guardian1Mobile,m.guardianPhone,m.guardian1Email,m.guardianEmail,
  m.guardian2Name,m.guardian2Mobile,m.guardian2Email
 ].some(v=>String(v??'').trim()!=='');
}

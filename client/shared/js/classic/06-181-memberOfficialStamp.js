function memberOfficialStamp(m){
 return {
  code:String(m.stampCode||'').trim(),
  label:String(m.stampLabel||'').trim(),
  startDate:normalizeDateCell(m.stampStartDate||''),
  endDate:normalizeDateCell(m.stampEndDate||'')
 };
}

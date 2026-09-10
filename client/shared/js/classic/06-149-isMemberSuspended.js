function isMemberSuspended(member){
 return disciplineForMember(member).some(d=>{
  if(!/suspension/i.test(String(d.decision||'')))return false;
  const today=disciplineToday(),start=disciplineDateOnly(d.effectDate),end=disciplineDateOnly(d.endDate);
  if(start&&end&&end<start)return false;
  if(end&&end<today)return false;
  if(start&&start>today)return false;
  if(start)return true;
  return d.isActive===true;
 });
}




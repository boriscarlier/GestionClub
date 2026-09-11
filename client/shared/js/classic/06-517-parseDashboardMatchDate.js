function parseDashboardMatchDate(value){
 if(!value)return null;
 const s=String(value).trim();

 // ISO / YYYY-MM-DD
 let m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
 if(m){
  const d=new Date(Number(m[1]),Number(m[2])-1,Number(m[3]),12,0,0);
  return isNaN(d)?null:d;
 }

 // DD/MM/YYYY
 m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
 if(m){
  const d=new Date(Number(m[3]),Number(m[2])-1,Number(m[1]),12,0,0);
  return isNaN(d)?null:d;
 }

 const d=new Date(s);
 return isNaN(d)?null:d;
}


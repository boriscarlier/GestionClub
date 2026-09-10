function formatMatchDateFr(value){
 if(!value)return '—';
 const s=String(value).trim();
 const m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
 if(!m)return s;
 const y=Number(m[1]),mo=Number(m[2]),d=Number(m[3]);
 const date=new Date(Date.UTC(y,mo-1,d));
 if(Number.isNaN(date.getTime()))return s;
 const txt=new Intl.DateTimeFormat('fr-FR',{
  weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'
 }).format(date);
 return txt.charAt(0).toUpperCase()+txt.slice(1);
}


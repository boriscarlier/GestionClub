function formatDisciplineDateTime(value){
 if(!value)return '—';
 const d=new Date(value);
 if(Number.isNaN(d.getTime()))return formatDisciplineDate(value);
 const dd=String(d.getDate()).padStart(2,'0');
 const mm=String(d.getMonth()+1).padStart(2,'0');
 const yyyy=d.getFullYear();
 const hh=String(d.getHours()).padStart(2,'0');
 const mi=String(d.getMinutes()).padStart(2,'0');
 return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}


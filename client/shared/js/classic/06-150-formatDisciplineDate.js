function formatDisciplineDate(value){
 if(!value)return '—';

 // Already formatted DD/MM/YYYY
 const s=String(value).trim();
 const fr=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
 if(fr)return `${fr[1].padStart(2,'0')}/${fr[2].padStart(2,'0')}/${fr[3]}`;

 // ISO or parseable date
 const d=parseDateSafe(value);
 if(!d || Number.isNaN(d.getTime()))return escapeHtml(s);

 const dd=String(d.getDate()).padStart(2,'0');
 const mm=String(d.getMonth()+1).padStart(2,'0');
 const yyyy=d.getFullYear();
 return `${dd}/${mm}/${yyyy}`;
}


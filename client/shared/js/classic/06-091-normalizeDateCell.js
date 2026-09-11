function normalizeDateCell(v){
 if(v==null||v==='')return '';
 if(v instanceof Date && !isNaN(v))return v.toISOString().slice(0,10);
 if(typeof v==='number' && window.XLSX && XLSX.SSF && XLSX.SSF.parse_date_code){
  const d=XLSX.SSF.parse_date_code(v);
  if(d)return `${String(d.y).padStart(4,'0')}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
 }
 const s=String(v).trim();
 const m=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/);
 if(m){let y=m[3];if(y.length===2)y='20'+y;return `${y}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;}
 return s;
}

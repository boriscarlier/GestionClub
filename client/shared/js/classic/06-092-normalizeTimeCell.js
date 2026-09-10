function normalizeTimeCell(v){
 if(v==null||v==='')return '';
 if(typeof v==='number' && v>=0 && v<1){
  const total=Math.round(v*24*60),h=Math.floor(total/60)%24,m=total%60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
 }
 const s=String(v).trim();
 const m=s.match(/(\d{1,2})[:hH](\d{2})?/);
 if(m)return `${m[1].padStart(2,'0')}:${(m[2]||'00').padStart(2,'0')}`;
 return s;
}

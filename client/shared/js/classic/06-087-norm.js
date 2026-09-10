function norm(v){
 return String(v==null?'':v).trim().toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/\s+/g,' ');
}

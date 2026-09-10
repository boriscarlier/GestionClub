function likelyFffDirectory(text,pageCount){
 const n=norm(text||'');
 return n.includes('annuaire clubs') || pageCount>6;
}


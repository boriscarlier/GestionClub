function uid(p){
 let id;
 do{
  uid.sequence=(uid.sequence||0)+1;
  const entropy=globalThis.crypto?.randomUUID?globalThis.crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
  id=String(p)+entropy+'-'+uid.sequence.toString(36);
 }while(Object.values(state||{}).some(rows=>Array.isArray(rows)&&rows.some(row=>row&&row.id===id)));
 return id;
}



function memberValue(id){
 const el=document.getElementById(id);
 return el?String(el.value??'').trim():'';
}

function memberNumberOrNull(id){
 const v=memberValue(id);
 if(v==='')return null;
 const n=Number(String(v).replace(',','.'));
 return Number.isFinite(n)?n:null;
}

function daysSinceImport(iso){
 if(!iso)return null;
 const t=new Date(iso).getTime();
 if(!Number.isFinite(t))return null;
 return Math.max(0,Math.floor((Date.now()-t)/86400000));
}

function prepareReferenceLicences(rows,headers){
 const groups=new Map(),stampFields=new Set(['stampCode','stampLabel','stampStartDate','stampEndDate']);
 for(const row of rows){
  if(!row||row.every(v=>String(v??'').trim()===''))continue;
  const rec=rowToRecord(row,headers,importSchemas.members);
  if(['personNumber','licenseNumber','last','first'].some(k=>!String(rec[k]??'').trim()))throw Error('Identifiant ou identité obligatoire manquant : import arrêté.');
  const previous=groups.get(rec.licenseNumber);
  const stamp={code:rec.stampCode||'',label:rec.stampLabel||'',startDate:rec.stampStartDate||'',endDate:rec.stampEndDate||''};
  if(previous){
   const a={...previous.base},b={...rec};for(const key of ['sourceData','sourceRows','officialStamps',...stampFields]){delete a[key];delete b[key];}
   const stampHeaders=new Set(importSchemas.members.fields.filter(f=>stampFields.has(f.key)).flatMap(f=>[f.label,...(f.aliases||[])]).map(norm));
   const rawIdentity=r=>Object.fromEntries(Object.entries(r.sourceData).filter(([key])=>!stampHeaders.has(norm(key))));
   if(JSON.stringify(a)!==JSON.stringify(b)||JSON.stringify(rawIdentity(previous.base))!==JSON.stringify(rawIdentity(rec)))throw Error('Deux lignes de la même licence présentent des différences hors cachets. Import arrêté pour contrôle.');
   previous.sourceRows.push(rec.sourceData);
   if(Object.values(stamp).some(Boolean)&&!previous.officialStamps.some(x=>JSON.stringify(x)===JSON.stringify(stamp)))previous.officialStamps.push(stamp);
  }else groups.set(rec.licenseNumber,{base:rec,sourceRows:[rec.sourceData],officialStamps:Object.values(stamp).some(Boolean)?[stamp]:[]});
 }
 return [...groups.values()].map(g=>{
  const rec={...g.base,sourceRows:g.sourceRows,officialStamps:g.officialStamps};
  if(g.officialStamps.length>1){rec.stampCode=g.officialStamps.map(s=>s.code).filter(Boolean).join(' / ');rec.stampLabel=g.officialStamps.map(s=>s.label).filter(Boolean).join(' / ');rec.stampStartDate='';rec.stampEndDate='';}
  return rec;
 });
}

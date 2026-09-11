function findHeaderMapping(headers,schema){
 const mapping={};
 headers.forEach((h,idx)=>{
  const nh=norm(h);
  schema.fields.forEach(f=>{
   if(mapping[f.key]!==undefined)return;
   if(f.aliases.map(norm).includes(nh)||norm(f.label)===nh)mapping[f.key]=idx;
  });
 });
 return mapping;
}

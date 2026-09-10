function detectDirectoryClubHeaders(page){
 const rows=groupPdfItemsIntoRows(page.items||[]);
 const width=page.width||595;
 const headers=[];

 rows.forEach((row,rowIndex)=>{
  const affToken=row.items.find(it=>/^\d{6}$/.test(String(it.str||'').trim()));
  if(!affToken)return;

  const affX=affToken.x;
  const nameItems=row.items.filter(it=>{
   const x=it.x;
   const txt=String(it.str||'').trim();
   return x>width*0.25 && x<affX-width*0.015 && txt && txt!==affToken.str;
  });
  const cityItems=row.items.filter(it=>it.x<width*0.25);
  const regionItems=row.items.filter(it=>it.x>affX+25);

  const name=normalizeClubTitle(nameItems.map(i=>i.str).join(' '));
  const city=normalizeClubTitle(cityItems.map(i=>i.str).join(' '));
  const region=normalizeClubTitle(regionItems.map(i=>i.str).join(' '));

  // Reject obvious false positives while keeping short legitimate club names.
  if(!name || name.length<3)return;
  if(/^(F\.?C\.?\s+LA\s+COUR|ANNUAIRE CLUBS)$/i.test(name) && !city)return;

  headers.push({
   rowIndex,
   y:row.y,
   name,
   city,
   affiliation:String(affToken.str).trim(),
   region
  });
 });

 return {rows,headers};
}


async function handleUnifiedImportFile(event){
 const target=document.getElementById('importTarget')?.value||'members';
 const file=event.target.files?.[0]; if(!file)return;
 unifiedSpecialFile=file;

 if(target==='discipline'){
  const info=document.getElementById('importPreviewInfo');
  const special=document.getElementById('unifiedSpecialImportPreview');
  try{
   if(info)info.textContent='Analyse du fichier discipline…';
   const ab=await file.arrayBuffer(),wb=XLSX.read(ab,{cellDates:true});
   const ws=wb.Sheets[wb.SheetNames[0]];
   const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:false,dateNF:'yyyy-mm-dd'});
   if(!rows.length)throw new Error('Fichier vide.');
   const headers=rows[0].map(String);
   const req=['Type dossier_2','Statut dossier','Numéro dossier_2','Numéro match','Numéro personne','Nom, prénom personne'];
   const missing=req.filter(x=>disciplineHeaderIndex(headers,x)<0);
   if(missing.length)throw new Error('Colonnes manquantes : '+missing.join(', '));
   window.__unifiedDisciplineRows=rows; window.__unifiedDisciplineHeaders=headers; unifiedSpecialPrepared=true;
   if(info)info.textContent=`${rows.length-1} dossier(s) détecté(s).`;
   if(special)special.innerHTML=`<div class="import-status ok"><strong>Fichier discipline reconnu</strong><div class="tiny">${rows.length-1} ligne(s) à importer.</div></div>`;
   setImportStep(2);
  }catch(err){
   unifiedSpecialPrepared=false;
   if(info)info.textContent='Erreur : '+(err.message||err);
   if(special)special.innerHTML=`<div class="import-status err">Erreur : ${err.message||err}</div>`;
  }
  return;
 }

 if(target==='opponents'){
  const info=document.getElementById('importPreviewInfo');
  const special=document.getElementById('unifiedSpecialImportPreview');
  try{
   if(info)info.textContent='Analyse de l’annuaire PDF complet…';
   const pages=await extractPdfPagesFromFile(file);
   let clubs=[],diagnostics=[];
   pages.forEach(p=>{
    const structured=splitStructuredDirectoryPage(p);
    clubs.push(...structured.clubs);
    diagnostics.push({page:p.page,headers:structured.headers.length});
   });
   pages.forEach(p=>{
    if(diagnostics.find(d=>d.page===p.page)?.headers===0)clubs.push(...splitDirectoryPageIntoClubs(p.text,p.page));
   });
   const byAff=new Map();
   clubs.forEach(c=>{
    const prev=byAff.get(c.affiliation);
    if(!prev||c.rawText.length>prev.rawText.length)byAff.set(c.affiliation,c);
   });
   clubs=[...byAff.values()].sort((a,b)=>a.name.localeCompare(b.name,'fr'));
   linkDirectoryClubsToMatches(clubs);
   opponentFffDirectoryDraft=clubs; window.__fffDirectoryDiagnostics=diagnostics;
   unifiedSpecialPrepared=clubs.length>0;
   if(info)info.textContent=`${clubs.length} club(s) détecté(s).`;
   if(special)special.innerHTML=clubs.length?`<div class="import-status ok"><strong>Annuaire FFF reconnu</strong><div class="tiny">${clubs.length} club(s) détecté(s).</div></div>`:`<div class="import-status err">Aucun club détecté.</div>`;
   setImportStep(2);
  }catch(err){
   unifiedSpecialPrepared=false;
   if(info)info.textContent='Erreur : '+(err.message||err);
   if(special)special.innerHTML=`<div class="import-status err">Erreur : ${err.message||err}</div>`;
  }
  return;
 }
 handleImportFile(event);
}

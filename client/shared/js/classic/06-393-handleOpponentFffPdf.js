async function handleOpponentFffPdf(event){
 const file=event.target.files?.[0];
 const status=document.getElementById('oppFffImportStatus');
 const result=document.getElementById('oppFffImportResult');
 if(!file)return;
 if(status)status.textContent='Analyse du PDF complet en cours…';
 if(result)result.innerHTML='';

 try{
  const pages=await extractPdfPagesFromFile(file);
  const fullText=pages.map(p=>p.text).join('\n');
  const directoryMode=fffImportMode==='directory' || (fffImportMode==='auto' && likelyFffDirectory(fullText,pages.length));

  if(directoryMode){
   let clubs=[];
   let diagnostics=[];
   pages.forEach(p=>{
    const structured=splitStructuredDirectoryPage(p);
    clubs.push(...structured.clubs);
    diagnostics.push({page:p.page,headers:structured.headers.length});
   });

   // Fallback to text parser only on pages where structural detection found nothing.
   pages.forEach(p=>{
    if(diagnostics.find(d=>d.page===p.page)?.headers===0){
     clubs.push(...splitDirectoryPageIntoClubs(p.text,p.page));
    }
   });

   // Deduplicate globally by affiliation, preferring the richest block.
   const byAff=new Map();
   clubs.forEach(c=>{
    const prev=byAff.get(c.affiliation);
    if(!prev || c.rawText.length>prev.rawText.length)byAff.set(c.affiliation,c);
   });
   clubs=[...byAff.values()].sort((a,b)=>a.name.localeCompare(b.name,'fr'));
   linkDirectoryClubsToMatches(clubs);
   opponentFffDirectoryDraft=clubs;
   opponentFffImportDraft=null;

   window.__fffDirectoryDiagnostics=diagnostics;
   if(status)status.textContent=`Annuaire analysé : ${clubs.length} club(s) détecté(s) sur ${pages.length} page(s).`;
   renderFffDirectoryPreview();
  }else{
   const text=fullText;
   const data=parseFffClubText(text);
   opponentFffImportDraft=data;
   opponentFffDirectoryDraft=[];

   const candidates=opponentNamesFromMatches();
   const exact=candidates.find(n=>opponentKey(n)===opponentKey(data.name));
   const approx=candidates.find(n=>{
    const a=opponentKey(n),b=opponentKey(data.name);
    return a&&b&&(a.includes(b)||b.includes(a));
   });
   data.matchName=exact||approx||'';

   if(status)status.textContent=`Fiche club analysée : ${file.name}`;
   renderOpponentFffImportPreview();
  }
 }catch(err){
  console.error('Import FFF PDF',err);
  if(status)status.textContent='Impossible d’analyser ce PDF dans ce navigateur.';
  if(result)result.innerHTML=`<div class="auto-proposal critical"><strong>Échec de lecture</strong><div class="tiny">${String(err.message||err)}.</div></div>`;
 }
}

function splitDirectoryPageIntoClubs(pageText,pageNo){
 const text=String(pageText||'').replace(/\r/g,'\n');
 const lines=text.split(/\n+/).map(cleanFffValue).filter(Boolean);

 // Footclubs annuaire pages usually expose each club with an affiliation number,
 // followed by labels such as Couleurs, Siège social, Président, Installation.
 const affiliationIdx=[];
 lines.forEach((line,i)=>{
  if(/^\d{6}$/.test(line)) affiliationIdx.push(i);
 });

 const clubs=[];
 for(let j=0;j<affiliationIdx.length;j++){
  const affIdx=affiliationIdx[j];
  const affiliation=lines[affIdx];
  const start=Math.max(0,affIdx-12);
  const end=j+1<affiliationIdx.length?Math.max(affIdx+1,affiliationIdx[j+1]-10):lines.length;
  const segment=lines.slice(start,end);

  // Find a likely uppercase club title in the context before affiliation.
  const before=lines.slice(start,affIdx);
  let name='';
  for(let k=before.length-1;k>=0;k--){
   const cand=before[k];
   if(
    cand.length>=4 &&
    /[A-ZÀ-ÖØ-Ý]/.test(cand) &&
    !/^(REUNION|LIBRE|REGIONALE|PAGE|COULEURS|SIÈGE SOCIAL|SIEGE SOCIAL|NIVEAU|TYPE)$/i.test(cand) &&
    !/@/.test(cand) &&
    !/^\d/.test(cand)
   ){
    name=normalizeClubTitle(cand);
    break;
   }
  }
  if(!name)continue;

  const segText=segment.join('\n');
  const data=parseDirectoryClubSegment(segText,name,affiliation,pageNo);
  if(data.name && data.affiliation) clubs.push(data);
 }

 // Deduplicate within the page by affiliation.
 const map=new Map();
 clubs.forEach(c=>map.set(c.affiliation,c));
 return [...map.values()];
}


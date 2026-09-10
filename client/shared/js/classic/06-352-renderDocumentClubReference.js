function renderDocumentClubReference(){
 const p=typeof clubProfileMerged==='function'?clubProfileMerged():{};
 const name=document.getElementById('docClubReferenceName');
 const meta=document.getElementById('docClubReferenceMeta');
 if(name)name.textContent=p.name||'FC LA COUR';
 if(meta){
  const bits=[];
  if(p.affiliation)bits.push('Affiliation '+p.affiliation);
  if(p.league)bits.push(p.league);
  if(p.address)bits.push(p.address);
  meta.textContent=bits.length?bits.join(' • '):'Paramétrage du club à compléter.';
 }
}


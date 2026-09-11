function documentCenterAll(){
 ensureDocumentCenterState();
 const official=(typeof officialDocs!=='undefined'?officialDocs:[]).map(d=>({
  id:'official-'+d.id,title:d.title||d.name||'Document officiel',category:'LRF / FFF',season:'2026',
  date:'2026-01-01',status:'Officiel',source:'LRF / FFF',url:d.url||'',ref:d.ref||'',description:d.description||d.category||''
 }));
 return [...official,...state.documentCenter];
}

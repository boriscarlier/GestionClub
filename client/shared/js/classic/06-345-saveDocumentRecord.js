function saveDocumentRecord(){
 ensureDocumentCenterState();
 const title=document.getElementById('docFormTitle')?.value.trim();
 if(!title){if(typeof toast==='function')toast('Documents','Le titre est obligatoire.');return;}
 const rec={
  id:'doc-'+Date.now(),
  title,
  category:document.getElementById('docFormCategory')?.value||'Administratif',
  season:document.getElementById('docFormSeason')?.value||'2026',
  date:document.getElementById('docFormDate')?.value||new Date().toISOString().slice(0,10),
  status:'Actif',
  source:'Club',
  url:document.getElementById('docFormUrl')?.value.trim()||'',
  ref:document.getElementById('docFormRef')?.value.trim()||'',
  description:document.getElementById('docFormDesc')?.value.trim()||''
 };
 state.documentCenter.unshift(rec);save();closeDocumentForm();renderDocumentCenter();
 ['docFormTitle','docFormUrl','docFormRef','docFormDesc'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
 if(typeof toast==='function')toast('Documents','Document enregistré.');
}

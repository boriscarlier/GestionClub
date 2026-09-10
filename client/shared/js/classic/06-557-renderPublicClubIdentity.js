function renderPublicClubIdentity(){
 const p=publicClubProfile();
 document.querySelectorAll('#publicApp .brand h1').forEach(el=>el.textContent=p.name);
 document.querySelectorAll('#publicApp .brand span').forEach(el=>{
  if(el.closest('.brand'))el.textContent=`${p.locality} • La Réunion`;
 });
 const meta=document.getElementById('publicClubMeta');
 if(meta){
  const items=[
   p.affiliation?`Affiliation ${p.affiliation}`:'',
   p.league,
   p.stadium
  ].filter(Boolean);
  meta.innerHTML=items.map(x=>`<span class="badge">${escapeHtml(x)}</span>`).join('');
 }
}

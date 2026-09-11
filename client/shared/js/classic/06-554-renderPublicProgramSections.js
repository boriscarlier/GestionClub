function renderPublicProgramSections(){
 const select=document.getElementById('publicProgramSection');
 if(!select)return;
 const current=publicProgramSection;
 const sections=[...new Set(publicVisibleMatches().map(publicMatchSection).filter(Boolean))]
  .sort((a,b)=>publicSectionLabel(a).localeCompare(publicSectionLabel(b),'fr'));
 select.innerHTML='<option value="">Toutes les sections</option>'+
  sections.map(s=>`<option value="${s}" ${s===current?'selected':''}>${publicSectionLabel(s)}</option>`).join('');
 if(current && !sections.includes(current)){
  publicProgramSection='';
  select.value='';
 }
}


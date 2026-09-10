function fillMemberFilters(){
 const cats=document.getElementById('memberCategoryFilter'),types=document.getElementById('memberTypeFilter'),lics=document.getElementById('memberLicenseFilter');
 if(!cats||!types||!lics)return;
 const oldC=cats.value,oldT=types.value,oldL=lics.value;
 const uniq=a=>[...new Set(a.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'fr'));
 const rows=memberSourceRows();
 cats.innerHTML='<option value="">Toutes catégories</option>'+uniq(rows.map(m=>m.category)).map(v=>`<option ${v===oldC?'selected':''}>${v}</option>`).join('');
 types.innerHTML='<option value="">Tous types</option>'+uniq(rows.map(m=>m.type||m.licenseType)).map(v=>`<option ${v===oldT?'selected':''}>${v}</option>`).join('');
 lics.innerHTML='<option value="">Tous statuts licence</option>'+uniq(rows.map(m=>m.license||m.status)).map(v=>`<option ${v===oldL?'selected':''}>${v}</option>`).join('');
}

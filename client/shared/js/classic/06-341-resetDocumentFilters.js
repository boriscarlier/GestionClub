function resetDocumentFilters(){
 const q=document.getElementById('docSearch'),c=document.getElementById('centerDocCategoryFilter'),s=document.getElementById('centerDocSeasonFilter');
 if(q)q.value='';if(c)c.value='';if(s)s.value='';
 renderDocumentCenter();
}

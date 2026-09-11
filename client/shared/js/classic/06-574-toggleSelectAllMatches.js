function toggleSelectAllMatches(checked){
 const visible=filteredMatchesForAdmin();
 if(checked)visible.forEach(m=>selectedMatchIds.add(m.id));
 else visible.forEach(m=>selectedMatchIds.delete(m.id));
 renderMatchList();
}

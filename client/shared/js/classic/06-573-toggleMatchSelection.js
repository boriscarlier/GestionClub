function toggleMatchSelection(id,checked){
 if(checked)selectedMatchIds.add(id);
 else selectedMatchIds.delete(id);
 renderMatchList();
}

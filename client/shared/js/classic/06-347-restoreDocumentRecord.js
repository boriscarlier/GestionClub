function restoreDocumentRecord(id){
 const d=(state.documentCenter||[]).find(x=>x.id===id);if(!d)return;
 d.status='Actif';save();renderDocumentCenter();
}

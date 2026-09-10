function archiveDocumentRecord(id){
 const d=(state.documentCenter||[]).find(x=>x.id===id);if(!d)return;
 d.status='Archivé';save();renderDocumentCenter();
}

function deleteDocumentRecord(id){
 state.documentCenter=(state.documentCenter||[]).filter(x=>x.id!==id);save();renderDocumentCenter();
}

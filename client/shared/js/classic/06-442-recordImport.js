function recordImport(type,meta={}){
 if(!state.importRegistry)state.importRegistry={};
 const now=new Date().toISOString();
 state.importRegistry[type]={
  type,
  filename:meta.filename||meta.fileName||'Fichier importé',
  importedAt:meta.importedAt||now,
  itemCount:Number(meta.itemCount??meta.count??0),
  source:meta.source||'Import manuel',
  note:meta.note||'',
  reimportRequired:false,
  updatedAt:now
 };

 if(typeof updateReimportProgress==='function')updateReimportProgress(type);

 // Persist even outside a full save(), so the tracking card updates immediately.
 localStorage.setItem(KEY,JSON.stringify(state));
}


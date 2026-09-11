function openDocumentRecord(id){
 const d=documentCenterAll().find(x=>x.id===id);if(!d)return;
 if(d.url)window.open(d.url,'_blank','noopener');
 else if(typeof toast==='function')toast('Documents','Aucun fichier ou lien n’est encore associé à ce document.');
}

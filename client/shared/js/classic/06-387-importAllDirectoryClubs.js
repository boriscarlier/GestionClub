function importAllDirectoryClubs(){
 if(!opponentFffDirectoryDraft.length)return;
 opponentFffDirectoryDraft.forEach(directoryClubToOpponent);
 recordImport('opponents',{filename:'Annuaire clubs FFF',itemCount:opponentFffDirectoryDraft.length,source:'Annuaire clubs FFF PDF'});
 save();
 toast('Import annuaire',`${opponentFffDirectoryDraft.length} clubs importés.`);
 setTimeout(()=>{
  goTo('importwatch');
  if(typeof renderImportWatch==='function')renderImportWatch();
 },150);
}

let opponentFffImportDraft=null;
let opponentFffPdfLibLoading=null;


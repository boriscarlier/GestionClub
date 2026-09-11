function importOneDirectoryClub(index){
 const c=opponentFffDirectoryDraft[index];
 if(!c)return;
 directoryClubToOpponent(c);
 recordImport('opponents',{filename:'Annuaire clubs FFF',itemCount:1,source:'Annuaire clubs FFF PDF',note:c.name});
 save();
 toast('Import annuaire',`${c.name} importé.`);
 setTimeout(()=>{
  goTo('importwatch');
  if(typeof renderImportWatch==='function')renderImportWatch();
 },150);
}


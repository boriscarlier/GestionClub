function downloadImportDatabaseBackup(){
 try{
  const payload=importDatabaseBackupPayload();
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  const stamp=new Date().toISOString().replace(/[:.]/g,'-');
  a.href=url;
  a.download=`GESTION_CLUB_sauvegarde_imports_${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast('Sauvegarde','Sauvegarde JSON générée.');
 }catch(e){
  console.error(e);
  toast('Sauvegarde','Impossible de générer la sauvegarde.');
 }
}


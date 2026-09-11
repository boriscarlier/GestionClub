async function qaImportBackupFile(event){
 const file=event.target.files?.[0];if(!file)return;
 try{
  const payload=JSON.parse(await file.text());
  if(payload?.format!=='GESTION_CLUB_FULL_BACKUP')throw new Error('Ce fichier n’est pas une sauvegarde complète compatible.');
  if(!confirm('Restaurer cette sauvegarde et remplacer les données locales ? Une copie de sécurité sera conservée.'))return;
  localStorage.setItem('gestionclub_before_restore_backup',JSON.stringify(qaBackupPayload()));qaRestoreBackup(payload);
  portalLogout();coachLogout();sessionStorage.removeItem('gestionclub_admin_account');qaDraftOwner=null;memberBlockEditState.clear();renderAll();showPublicPage('public-home');toast('Sauvegarde','Restauration terminée. Sélectionnez à nouveau votre compte.');
 }catch(e){toast('Restauration refusée',String(e.message||e));}
 finally{event.target.value='';}
}


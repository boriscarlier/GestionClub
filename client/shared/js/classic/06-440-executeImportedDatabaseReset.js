function executeImportedDatabaseReset(){
 if(!currentAdminCan('imports','delete')){toast('Accès refusé','Réinitialisation non autorisée.');return false;}
 if(!document.getElementById('resetConfirmImportedData')?.checked||!document.getElementById('resetConfirmBackup')?.checked){toast('Réinitialisation','Les deux confirmations sont nécessaires.');return false;}
 const before=JSON.parse(JSON.stringify(state)),oldLineups=coachLineups;
 try{
  // Échec de sauvegarde = aucune suppression.
  localStorage.setItem('fclc_last_import_reset_backup',JSON.stringify(importDatabaseBackupPayload()));
  state={...state,members:[],matches:[],discipline:[],opponents:[],importedDataNeedsRelinking:true};
  state.importRegistry={...state.importRegistry};['members','matches','discipline','opponents'].forEach(k=>delete state.importRegistry[k]);
  state.importHistory=[]; // Les compositions et présences saisies ne font pas partie des quatre bases importées.
  localStorage.setItem(KEY,JSON.stringify(state));saveCoachLineups();
 }catch(e){state=before;coachLineups=oldLineups;try{localStorage.setItem(KEY,JSON.stringify(before));saveCoachLineups();}catch(x){}setResetImportStatus('Réinitialisation arrêtée : stockage indisponible.','error');return false;}
 ['fclc_portal_member','fclc_coach_member','fclc_coach_team'].forEach(k=>localStorage.removeItem(k));portalCurrentMemberId=null;coachCurrentMemberId=null;
 document.getElementById('resetFinalConfirm')?.classList.remove('active');
 ['resetConfirmImportedData','resetConfirmBackup'].forEach(id=>document.getElementById(id).checked=false);
 logAdminAction('Imports','Réinitialisation','Sauvegarde complète créée ; quatre bases importées vidées. Présences et compositions conservées, rattachements à vérifier après réimport.');renderAll();setResetImportStatus('Bases réinitialisées. Paramétrage du club conservé.','ok');return true;
}

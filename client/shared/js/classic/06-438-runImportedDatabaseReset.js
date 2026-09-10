function runImportedDatabaseReset(){
 const c1=!!document.getElementById('resetConfirmImportedData')?.checked;
 const c2=!!document.getElementById('resetConfirmBackup')?.checked;

 if(!c1||!c2){
  setResetImportStatus('Cochez les deux confirmations avant de continuer.','error');
  if(typeof toast==='function')toast('Réinitialisation','Cochez les deux confirmations avant de continuer.');
  return false;
 }

 const panel=document.getElementById('resetFinalConfirm');
 if(panel)panel.classList.add('active');
 setResetImportStatus('Confirmation finale requise.');
 panel?.scrollIntoView({behavior:'smooth',block:'center'});
 return true;
}


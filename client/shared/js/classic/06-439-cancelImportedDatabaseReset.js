function cancelImportedDatabaseReset(){
 const panel=document.getElementById('resetFinalConfirm');
 if(panel)panel.classList.remove('active');
 setResetImportStatus('Réinitialisation annulée.');
}


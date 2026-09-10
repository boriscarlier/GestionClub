function syncAdminNavGroups(page){
 document.querySelectorAll('#intranetApp .nav-group').forEach(g=>g.classList.remove('has-active'));
 const group=adminNavGroupForPage(page);
 if(group){
  document.querySelectorAll('#intranetApp .nav-group').forEach(g=>g.classList.remove('open'));
  group.classList.add('open','has-active');
 }
}

document.querySelectorAll('.nav button[data-page]').forEach(b=>b.addEventListener('click',()=>{
 statsDrilldownOrigin=false;
 sessionStorage.removeItem('fclc_stats_drilldown');
 closeAdministrationTransientUI(b.dataset.page);
 goTo(b.dataset.page);
}));

const __backupBtn=document.getElementById('btnBackupImportedData');
if(__backupBtn){
 __backupBtn.addEventListener('click',()=>{
  setResetImportStatus('Préparation de la sauvegarde…');
  try{
   downloadImportDatabaseBackup();
   setResetImportStatus('Sauvegarde générée.','ok');
  }catch(err){
   console.error(err);
   setResetImportStatus('Erreur pendant la sauvegarde : '+(err?.message||err),'error');
  }
 });
}
const __resetBtn=document.getElementById('btnResetImportedData');
if(__resetBtn){
 __resetBtn.addEventListener('click',runImportedDatabaseReset);
}
const __resetFinalBtn=document.getElementById('btnResetImportedDataFinal');
if(__resetFinalBtn){
 __resetFinalBtn.addEventListener('click',executeImportedDatabaseReset);
}
const __resetCancelBtn=document.getElementById('btnCancelImportedDataReset');
if(__resetCancelBtn){
 __resetCancelBtn.addEventListener('click',cancelImportedDatabaseReset);
}



let activeTeamFilter='all';
let currentTeamId=null;


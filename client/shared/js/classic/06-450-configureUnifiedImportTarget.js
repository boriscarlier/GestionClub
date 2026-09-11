function configureUnifiedImportTarget(){
 const target=document.getElementById('importTarget')?.value||'members';
 const file=document.getElementById('importFile');
 const hint=document.getElementById('importFileTypeHint');
 const generic=document.getElementById('genericImportPreviewTable');
 const special=document.getElementById('unifiedSpecialImportPreview');
 const sheet=document.getElementById('importSheet');
 const header=document.getElementById('importHeaderRow');
 const strategy=document.getElementById('importStrategy');
 unifiedSpecialFile=null; unifiedSpecialPrepared=false;
 if(special)special.innerHTML='';
 if(target==='opponents'){
  if(file)file.accept='application/pdf,.pdf';
  if(hint)hint.textContent='.pdf • Annuaire clubs FFF';
  if(generic)generic.style.display='none';
  if(sheet?.closest('.field'))sheet.closest('.field').style.display='none';
  if(header?.closest('.field'))header.closest('.field').style.display='none';
  if(strategy?.closest('.field'))strategy.closest('.field').style.display='none';
 }else{
  if(file)file.accept='.xlsx,.xls,.csv,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  if(hint)hint.textContent='.xlsx • .xls • .csv';
  if(generic)generic.style.display=target==='discipline'?'none':'';
  if(sheet?.closest('.field'))sheet.closest('.field').style.display='';
  if(header?.closest('.field'))header.closest('.field').style.display=target==='discipline'?'none':'';
  if(strategy?.closest('.field'))strategy.closest('.field').style.display=target==='discipline'?'none':'';
 }
 if(typeof updateExpectedColumns==='function')updateExpectedColumns();
}

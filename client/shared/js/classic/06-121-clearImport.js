function clearImport(){
 importWorkbook=null;importRawRows=[];importRows=[];importFileName='';unifiedSpecialFile=null;unifiedSpecialPrepared=false;window.__unifiedDisciplineRows=null;window.__unifiedDisciplineHeaders=null;
 const f=document.getElementById('importFile');if(f)f.value='';
 document.getElementById('importSheet').innerHTML='<option value="">—</option>';
 document.getElementById('importFileStatus').className='import-status warn';document.getElementById('importFileStatus').textContent='Aucun fichier chargé.';
 document.getElementById('importPreviewHead').innerHTML='';document.getElementById('importPreviewBody').innerHTML='';document.getElementById('importPreviewInfo').textContent='Charge un fichier pour afficher les premières lignes.';
 setImportStep(1);
}

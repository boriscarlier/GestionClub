function openImportForTarget(target){
 goTo('import');
 const select=document.getElementById('importTarget');
 if(select&&target){select.value=target;configureUnifiedImportTarget();}
 const zone=document.getElementById('importFileStatus');
 if(zone){
  const labels=unifiedImportLabels();
  zone.className='import-status warn';
  zone.textContent=`Destination sélectionnée : ${labels[target]||target}. Choisissez maintenant le fichier.`;
 }
 setImportStep(1);
 setTimeout(()=>document.getElementById('importFile')?.click(),50);
}


async function handleImportFile(event){
 const file=event.target.files && event.target.files[0];if(!file)return;
 importFileName=file.name;
 const ext=file.name.split('.').pop().toLowerCase();
 const status=document.getElementById('importFileStatus');
 try{
  if(ext==='csv' && !window.XLSX){
   const text=await file.text();
   importWorkbook=null;
   importRawRows=parseCsvFallback(text);
   document.getElementById('importSheet').innerHTML='<option value="CSV">CSV</option>';
   importRows=importRawRows;
   status.className='import-status ok';status.innerHTML=`<strong>${file.name}</strong><div class="tiny">CSV chargé • mode local</div>`;
   buildImportPreview();setImportStep(2);return;
  }
  if(!window.XLSX)throw new Error('Prototype autonome : l’import Excel XLSX n’est pas embarqué. Utilise un fichier CSV pour un test hors ligne.');
  const ab=await file.arrayBuffer();
  importWorkbook=XLSX.read(ab,{cellDates:true});
  document.getElementById('importSheet').innerHTML=importWorkbook.SheetNames.map(n=>`<option value="${n}">${n}</option>`).join('');
  selectImportSheet();
  status.className='import-status ok';status.innerHTML=`<strong>${file.name}</strong><div class="tiny">${importWorkbook.SheetNames.length} feuille(s) détectée(s)</div>`;
  setImportStep(2);
 }catch(err){
  status.className='import-status err';status.innerHTML=`<strong>Erreur de lecture</strong><div class="tiny">${err.message||err}</div>`;
 }
}

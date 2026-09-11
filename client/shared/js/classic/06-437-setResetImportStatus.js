function setResetImportStatus(message,kind=''){
 const box=document.getElementById('resetImportStatus');
 if(!box)return;
 box.textContent=message||'';
 box.style.fontWeight=kind?'700':'';
 box.style.color=kind==='error'?'#ff7b7b':kind==='ok'?'#8ee59b':'';
}

function setFffImportMode(mode,btn){
 fffImportMode=mode;
 document.querySelectorAll('[data-fff-mode]').forEach(b=>b.classList.toggle('active',b===btn));
}


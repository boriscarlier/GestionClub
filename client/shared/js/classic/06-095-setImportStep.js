function setImportStep(n){
 for(let i=1;i<=4;i++){const e=document.getElementById('impStep'+i);if(e)e.classList.toggle('active',i===n);}
}

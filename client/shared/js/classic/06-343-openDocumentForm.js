function openDocumentForm(){
 const f=document.getElementById('documentForm');if(f)f.style.display='block';
 const d=document.getElementById('docFormDate');if(d&&!d.value)d.value=new Date().toISOString().slice(0,10);
}

function togglePrototypeTester(force){
 const panel=document.getElementById('prototypeTesterPanel');if(!panel)return;
 const open=typeof force==='boolean'?force:!panel.classList.contains('open');
 panel.classList.toggle('open',open);
}

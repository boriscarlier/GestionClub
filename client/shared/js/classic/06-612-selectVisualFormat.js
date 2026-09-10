function selectVisualFormat(format,el){
 currentVisualFormat=format;
 document.querySelectorAll('.visual-formatbar button').forEach(x=>x.classList.remove('active'));
 if(el) el.classList.add('active');
 generateVisual();
}


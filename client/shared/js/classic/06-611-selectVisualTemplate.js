function selectVisualTemplate(type,el){
 currentVisualTemplate=type;
 document.querySelectorAll('.visual-template').forEach(x=>x.classList.remove('active'));
 if(el) el.classList.add('active');
 renderVisualFields();
 generateVisual();
}


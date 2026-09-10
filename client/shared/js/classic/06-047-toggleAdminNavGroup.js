function toggleAdminNavGroup(name,button){
 const group=document.querySelector(`.nav-group[data-nav-group="${name}"]`);
 if(!group)return;
 const willOpen=!group.classList.contains('open');

 // Mode accordéon : un seul grand sous-menu ouvert à la fois.
 document.querySelectorAll('.nav-group').forEach(g=>{
  if(g!==group)g.classList.remove('open');
 });
 group.classList.toggle('open',willOpen);
}

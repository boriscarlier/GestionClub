function portalGo(name){
 document.querySelectorAll('.portal-page').forEach(p=>p.classList.toggle('active',p.id==='portal-'+name));
}

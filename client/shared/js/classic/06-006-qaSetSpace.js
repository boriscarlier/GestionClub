function qaSetSpace(space){
 qaSpace=space;
 document.body.dataset.appSpace=space;
 const pub=document.getElementById('publicApp'),admin=document.getElementById('intranetApp'),login=document.getElementById('adminLoginScreen');
 if(pub){pub.classList.toggle('hidden',space==='admin'||space==='login');pub.style.removeProperty('display');pub.style.removeProperty('visibility');pub.style.removeProperty('pointer-events');}
 if(admin&&space!=='admin'){admin.classList.add('hidden');admin.style.display='none';}
 if(login&&space!=='login'){login.classList.add('hidden');login.style.display='none';}
 if(space!=='coach')toggleCoachMobileMore(false);
 if(space!=='admin')closeAdminMobileSidebar();
}


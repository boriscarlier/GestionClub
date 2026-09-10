function toggleAdminMobileSidebar(force){
 const side=document.querySelector('#intranetApp .sidebar');if(!side)return;
 const open=(typeof force==='boolean'?force:!side.classList.contains('mobile-open'))&&innerWidth<=1024;
 side.classList.toggle('mobile-open',open);document.body.classList.toggle('admin-sidebar-open',open);
 let shade=document.getElementById('qaAdminShade');if(!shade){shade=document.createElement('button');shade.id='qaAdminShade';shade.type='button';shade.setAttribute('aria-label','Fermer le menu Administration');shade.onclick=()=>closeAdminMobileSidebar();document.getElementById('intranetApp').append(shade);}shade.hidden=!open;
 const trigger=document.querySelector('.admin-mobile-menu-btn');if(trigger)trigger.setAttribute('aria-expanded',String(open));
}

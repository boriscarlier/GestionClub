function closeAdminMobileSidebar(){
 document.querySelector('#intranetApp .sidebar')?.classList.remove('mobile-open');document.body.classList.remove('admin-sidebar-open');
 const shade=document.getElementById('qaAdminShade');if(shade)shade.hidden=true;
 document.querySelector('.admin-mobile-menu-btn')?.setAttribute('aria-expanded','false');
}


function applyAdminPermissions(){
 const a=currentAdminAccount();
 document.querySelectorAll('#intranetApp .nav button[data-page]').forEach(btn=>{
  const mod=PAGE_PERMISSION_MODULE[btn.dataset.page]||btn.dataset.page;
  btn.style.display=accountCan(a,mod,'view')?'':'none';
 });
 document.querySelectorAll('#intranetApp .nav-group').forEach(group=>{
  const visible=[...group.querySelectorAll('.nav-submenu button[data-page]')].some(b=>b.style.display!=='none');
  group.style.display=visible?'':'none';
 });
}

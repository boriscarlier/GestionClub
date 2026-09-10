function adminPageExists(page){
 const el=document.getElementById(page);
 return !!(el && el.classList.contains('page') && el.closest('#intranetApp'));
}


let statsDrilldownOrigin=false;


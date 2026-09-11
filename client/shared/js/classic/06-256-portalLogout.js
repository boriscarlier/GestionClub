function portalLogout(){
 portalCurrentMemberId=null;localStorage.removeItem('gestionclub_portal_member');
 const a=document.getElementById('portalApp'),l=document.getElementById('portalLogin');
 if(a)a.style.display='none';if(l)l.style.display='block';
}

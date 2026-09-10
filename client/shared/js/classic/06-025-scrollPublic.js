function scrollPublic(id){
 const target=document.getElementById(id);
 if(!target)return false;
 const publicPage=target.closest('.public-page');
 if(publicPage && !publicPage.classList.contains('active') && typeof showPublicPage==='function'){
  showPublicPage('public-home');
 }
 requestAnimationFrame(()=>{
  const el=document.getElementById(id);
  if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
 });
 return true;
}


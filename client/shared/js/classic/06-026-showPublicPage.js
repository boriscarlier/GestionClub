function showPublicPage(id){
 const aliases={news:'public-news',teams:'public-teams',teamdetail:'public-teamdetail',history:'public-history',charter:'public-charter',actions:'public-actions',shop:'public-shop',links:'public-links',member:'public-member',home:'public-home',programme:'public-programme',coach:'public-coach'};
 id=aliases[id]||id;const target=document.getElementById(id);
 if(!target?.classList.contains('public-page'))return false;
 closeAdministrationTransientUI('public');qaSetSpace(id==='public-coach'?'coach':id==='public-member'?'member':'public');
 document.querySelectorAll('.public-page').forEach(e=>{e.classList.toggle('active',e===target);e.style.pointerEvents=e===target?'auto':'none';});
 for(const [space,appId,loginId,memberId,renderer]of [['public-coach','coachApp','coachLogin',coachCurrentMemberId,renderCoachPortal],['public-member','portalApp','portalLogin',portalCurrentMemberId,renderMemberPortal]]){
  const app=document.getElementById(appId),login=document.getElementById(loginId);
  [app,login].forEach(e=>{if(e){e.style.removeProperty('visibility');e.style.removeProperty('pointer-events');}});
  if(app)app.style.display=id===space&&memberId?'block':'none';
  if(login)login.style.display=id===space&&!memberId?'block':'none';
  if(id===space&&memberId)renderer();
 }
 closeMobileMenu();window.scrollTo({top:0,behavior:'auto'});
 if(id==='public-programme')renderPublicProgram();return true;
}

function prototypeOpenMemberTest(){
 showPublicPage('public-member');
 setTimeout(()=>{fillMemberDemoAccess();window.scrollTo({top:0,behavior:'smooth'});},50);
 togglePrototypeTester(false);
}

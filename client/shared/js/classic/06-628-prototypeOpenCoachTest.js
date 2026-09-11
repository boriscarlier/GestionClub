function prototypeOpenCoachTest(){
 showPublicPage('public-coach');
 setTimeout(()=>{fillCoachDemoAccess();window.scrollTo({top:0,behavior:'smooth'});},50);
 togglePrototypeTester(false);
}

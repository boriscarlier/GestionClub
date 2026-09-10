// CI-only browser parity test. Test data and server database are temporary.
const fs=require('node:fs');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const manifest=JSON.parse(fs.readFileSync('client/manager.sources.json','utf8'));
const out=process.env.FCLC_QA_OUTPUT||'releases/modular-qa';
fs.mkdirSync(out,{recursive:true});
const server=spawn(process.env.PYTHON||'python3',['scripts/test_modular_browser_server.py']);
server.stderr.pipe(process.stderr);
let browser;
const report={pages:[],css:[],errors:[]};
const timer=setTimeout(()=>{server.kill();process.exit(1);},12*60*1000);

async function select(page,target){
  await page.evaluate(({id,space})=>{
    if(space==='public')return showPublicPage(id);
    if(space==='admin'){
      // Existing fictitious prototype account, never a real club account.
      const account=state.accounts.find(a=>a.id==='demo_account_admin');
      if(!account)throw Error('Fictitious admin account not found');
      sessionStorage.setItem('fclc_admin_account',account.id);
      enterAdministrationAuthenticated();return goTo(id);
    }
    if(space==='coach'){
      if(!state.members.some(m=>m.id==='demo_member_coach'))throw Error('Fictitious coach not found');
      coachCurrentMemberId='demo_member_coach';
      showPublicPage('public-coach');
      renderCoachPortal();coachGo(id.replace(/^coach-/,''));
    }else{
      if(!state.members.some(m=>m.id==='demo_member_adherent'))throw Error('Fictitious member not found');
      portalCurrentMemberId='demo_member_adherent';
      showPublicPage('public-member');
      renderMemberPortal();portalGo(id.replace(/^portal-/,''));
    }
  },target);
  await page.waitForLoadState('networkidle');
}

(async()=>{
  const port=await new Promise((resolve,reject)=>{
    let text='';server.stdout.on('data',data=>{text+=data;const line=text.split('\n')[0];try{resolve(JSON.parse(line).port);}catch{}});
    server.on('exit',code=>reject(Error('Fixture exited '+code)));
  });
  const base='http://127.0.0.1:'+port;
  browser=await chromium.launch({headless:true});
  for(const viewport of [{width:1440,height:1000},{width:1024,height:900},{width:390,height:844}]){
    const contexts=[];
    const pages=[];
    let storage=null;
    for(const route of ['/gestion-legacy','/gestion-modulaire']){
      const context=await browser.newContext({viewport});contexts.push(context);
      await context.route('**/*',r=>r.request().url().startsWith(base+'/')?r.continue():r.abort());
      const response=await context.request.post(base+'/api/login',{headers:{Origin:base},data:{name:'browser-fixture',password:'Fiction-only-password-123'}});
      if(!response.ok())throw Error('Server login failed');
      if(storage)await context.addInitScript(values=>{for(const [key,value]of Object.entries(values))localStorage.setItem(key,value);},storage);
      const page=await context.newPage();pages.push(page);
      page.on('pageerror',e=>report.errors.push({route,message:e.message}));
      await page.clock.setFixedTime(new Date('2026-09-10T12:00:00Z'));
      await page.goto(base+route,{waitUntil:'networkidle'});
      if(!storage)storage=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));
      await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
    }
    if(!report.css.length){
      report.css=await pages[0].evaluate(()=>{
        const rows=[];
        function walk(rules,context=[]){for(const rule of rules){
          if(rule.selectorText)rows.push({selector:rule.selectorText,context,declarations:rule.style.cssText});
          else if(rule.cssRules)walk(rule.cssRules,[...context,rule.conditionText||rule.name||rule.cssText.split('{')[0]]);
        }}
        for(const [i,sheet]of [...document.styleSheets].entries())walk(sheet.cssRules,['stylesheet-'+i]);
        return rows;
      });
    }
    for(const target of manifest.pages){
      for(const page of pages)await select(page,target);
      const images=[];
      for(const page of pages)images.push(await page.screenshot({animations:'disabled'}));
      const same=images[0].equals(images[1]);
      report.pages.push({id:target.id,width:viewport.width,equal:same});
      if(!same){
        fs.writeFileSync(out+'/'+viewport.width+'-'+target.id+'-legacy.png',images[0]);
        fs.writeFileSync(out+'/'+viewport.width+'-'+target.id+'-modular.png',images[1]);
        throw Error('Visual difference: '+target.id+' at '+viewport.width);
      }
    }
    for(const context of contexts)await context.close();
  }
  // Any baseline error is an explicit blocker; do not silently call it a pass.
  if(report.errors.length)throw Error('Browser errors: '+JSON.stringify(report.errors));
  console.log('Visual parity: '+report.pages.length+' checks passed');
})().catch(e=>{console.error(e);report.failure=e.message;process.exitCode=1;}).finally(async()=>{
  fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));
  if(browser)await browser.close();server.kill();clearTimeout(timer);
});

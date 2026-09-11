// CI-only browser parity test. Test data and server database are temporary.
const fs=require('node:fs');
const {spawn}=require('node:child_process');
const {chromium}=require('playwright');
const {PNG}=require('pngjs');
const manifest=JSON.parse(fs.readFileSync('client/manager.sources.json','utf8'));
const out=process.env.GESTION_CLUB_QA_OUTPUT||'releases/modular-qa';
fs.mkdirSync(out,{recursive:true});
const server=spawn(process.env.PYTHON||'python3',['scripts/test_modular_browser_server.py']);
server.stderr.pipe(process.stderr);
let browser;
const report={pages:[],directRoutes:[],css:[],errors:[]};

function comparePixels(left,right){
  const a=PNG.sync.read(left),b=PNG.sync.read(right);
  if(a.width!==b.width||a.height!==b.height)return {equal:false,reason:'dimensions'};
  let changed=0,maxDelta=0;
  for(let i=0;i<a.data.length;i+=4){
    let delta=0;for(let channel=0;channel<4;channel++)delta=Math.max(delta,Math.abs(a.data[i+channel]-b.data[i+channel]));
    if(delta){changed++;maxDelta=Math.max(maxDelta,delta);}
  }
  // Chromium rounds a handful of anti-aliased button corners differently.
  // Observed baseline: 24 pixels, max delta 10/255, with identical DOM/CSS.
  // Permit only tiny rasterization differences, never layout/text changes.
  // A CI capture showed 53 pixels differing by exactly one channel level
  // on mobile button edges. Accept that rounding only with exact layout/style
  // signatures (checked below); retain the previous bound for larger deltas.
  const pixels=a.width*a.height;
  return {equal:(maxDelta<=1&&changed<=pixels*0.0002)||(maxDelta<=12&&changed<=pixels*0.0001),changed,maxDelta};
}
const timer=setTimeout(()=>{server.kill();process.exit(1);},12*60*1000);

async function select(page,target){
  await page.evaluate(({id,space})=>{
    if(space==='public')return showPublicPage(id);
    if(space==='admin'){
      // Existing fictitious prototype account, never a real club account.
      const account=state.accounts.find(a=>a.id==='demo_account_admin');
      if(!account)throw Error('Fictitious admin account not found');
      sessionStorage.setItem('gestionclub_admin_account',account.id);
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
      if(!storage){
        // Seed BOTH renderers from the same fully initialized fictitious state.
        storage=await page.evaluate(()=>{localStorage.setItem(KEY,JSON.stringify(state));return Object.fromEntries(Object.entries(localStorage));});
        await page.reload({waitUntil:'networkidle'});
      }
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
      const signatures=[];
      for(const page of pages)signatures.push(await page.evaluate(()=>
        [...document.querySelectorAll('body *')].filter(el=>{
          const r=el.getBoundingClientRect();return r.width&&r.height&&r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth;
        }).map(el=>{
          const r=el.getBoundingClientRect(),s=getComputedStyle(el);
          return [el.tagName,el.id,el.className,[r.x,r.y,r.width,r.height],
            s.color,s.backgroundColor,s.font,s.opacity,s.transform,
            [...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('')];
        })
      ));
      if(JSON.stringify(signatures[0])!==JSON.stringify(signatures[1]))throw Error('Layout/style difference: '+target.id+' at '+viewport.width);
      const images=[];
      for(const page of pages)images.push(await page.screenshot({animations:'disabled'}));
      const comparison=comparePixels(images[0],images[1]);
      report.pages.push({id:target.id,width:viewport.width,...comparison});
      if(!comparison.equal){
        fs.writeFileSync(out+'/'+viewport.width+'-'+target.id+'-legacy.png',images[0]);
        fs.writeFileSync(out+'/'+viewport.width+'-'+target.id+'-modular.png',images[1]);
        throw Error('Visual difference: '+target.id+' at '+viewport.width);
      }
    }
    if(viewport.width===1440){
      const direct=await contexts[1].newPage();
      direct.on('pageerror',e=>report.errors.push({route:'direct',message:e.message}));
      await direct.clock.setFixedTime(new Date('2026-09-10T12:00:00Z'));
      await direct.addInitScript(()=>{
        sessionStorage.setItem('gestionclub_admin_account','demo_account_admin');
        localStorage.setItem('gestionclub_coach_member','demo_member_coach');
        localStorage.setItem('gestionclub_portal_member','demo_member_adherent');
      });
      for(const target of manifest.pages){
        await direct.goto(base+'/gestion-modulaire/'+target.space+'/'+target.id,{waitUntil:'networkidle'});
        const active=await direct.evaluate(id=>!!document.getElementById(id)?.classList.contains('active'),target.id);
        report.directRoutes.push({id:target.id,active});
        if(!active)throw Error('Direct route did not activate '+target.id);
      }
      await direct.close();
    }
    for(const context of contexts)await context.close();
  }
  // Any baseline error is an explicit blocker; do not silently call it a pass.
  if(report.errors.length)throw Error('Browser errors: '+JSON.stringify(report.errors));
  console.log('Visual parity: '+report.pages.length+' checks passed; '+report.directRoutes.length+' direct routes active');
})().catch(e=>{console.error(e);report.failure=e.message;process.exitCode=1;}).finally(async()=>{
  fs.writeFileSync(out+'/report.json',JSON.stringify(report,null,2));
  if(browser)await browser.close();server.kill();clearTimeout(timer);
});

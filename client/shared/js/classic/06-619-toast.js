function toast(title,msg){const el=document.createElement('div');el.className='toast';el.innerHTML=`<strong>${title}</strong><div class="tiny">${msg}</div>`;toastwrap.appendChild(el);setTimeout(()=>el.remove(),3200)}


// Logo injection wrappers — defined after all original renderers exist.
if(typeof renderAll==='function'){
 const __renderAllLogo=renderAll;
 renderAll=function(){
  const r=__renderAllLogo.apply(this,arguments);
  applyClubLogoAssets(document);
  enhanceMatchCardsWithClubLogo(document);
  return r;
 };
}
if(typeof renderMemberPortal==='function'){
 const __renderMemberPortalLogo=renderMemberPortal;
 renderMemberPortal=function(){
  const r=__renderMemberPortalLogo.apply(this,arguments);
  enhanceMatchCardsWithClubLogo(document.getElementById('public-member')||document);
  return r;
 };
}
if(typeof renderCoachPortal==='function'){
 const __renderCoachPortalLogo=renderCoachPortal;
 renderCoachPortal=function(){
  const r=__renderCoachPortalLogo.apply(this,arguments);
  enhanceMatchCardsWithClubLogo(document.getElementById('public-coach')||document);
  return r;
 };
}

try{
 const startupStep=(name,fn)=>{
  try{if(typeof fn==='function')fn();}
  catch(stepErr){console.error(`Erreur démarrage ${name}:`,stepErr);}
 };
 startupStep('logo/preload',typeof preloadClubLogo==='function'?preloadClubLogo:null);
 startupStep('logo/assets',typeof applyClubLogoAssets==='function'?()=>applyClubLogoAssets(document):null);
 startupStep('migration état',typeof migrateState==='function'?migrateState:null);
 startupStep('migration CMS',typeof migrateCms==='function'?migrateCms:null);
 startupStep('migration médias',typeof migrateMedia==='function'?migrateMedia:null);
 startupStep('cycle discipline',typeof syncDisciplineLifecycle==='function'?syncDisciplineLifecycle:null);
 startupStep('champs visuels',typeof renderVisualFields==='function'?renderVisualFields:null);
 startupStep('rendu général',typeof renderAll==='function'?renderAll:null);
 startupStep('espace adhérent',typeof initMemberPortal==='function'?initMemberPortal:null);
 startupStep('portail éducateur',typeof initCoachPortal==='function'?initCoachPortal:null);
 startupStep('générateur visuel',typeof generateVisual==='function'?generateVisual:null);
 startupStep('logos cartes matchs',typeof enhanceMatchCardsWithClubLogo==='function'?()=>enhanceMatchCardsWithClubLogo(document):null);
 startupStep('logo final',typeof applyClubLogoAssets==='function'?()=>applyClubLogoAssets(document):null);
}catch(err){
 console.error('FC LA COUR startup error:',err);
 var box=document.createElement('div');
 box.style.cssText='position:fixed;left:20px;right:20px;bottom:20px;z-index:9999;background:#2a1111;color:#fff;border:1px solid #ef4444;border-radius:14px;padding:14px;font-family:system-ui';
 box.innerHTML='<strong>Erreur de démarrage détectée</strong><div style="margin-top:6px;font-size:12px">'+String(err.message||err)+'</div>';
 document.body.appendChild(box);
}

// V1.21.19.1 — état responsive global, exploité par les sous-versions suivantes.

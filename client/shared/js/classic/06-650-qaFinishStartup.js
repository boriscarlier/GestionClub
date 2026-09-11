function qaFinishStartup(){
 document.title='CLUB EXEMPLE Manager — gestionclub.local — '+QA_BUILD;
 if(typeof coachLineups==='object'){try{const data=JSON.parse(localStorage.getItem('gestionclub_coach_lineups')||'{}');if(data&&typeof data==='object'&&!Array.isArray(data))coachLineups=data;}catch(e){}}
 toggleCoachMobileMore(false);qaSetSpace('public');renderAll();try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){toast('Stockage','Modifications non persistantes : sauvegardez vos données.');}window.GESTION_CLUB_HEALTH=prototypeHealthCheck();
}
document.addEventListener('DOMContentLoaded',qaFinishStartup);
if(document.readyState!=='loading')qaFinishStartup();
document.addEventListener('keydown',e=>{
 const sheet=document.getElementById('coachMobileMoreSheet');
 if(e.key==='Tab'&&sheet?.classList.contains('open')){const els=[...sheet.querySelectorAll('button,a,input,select')].filter(x=>!x.disabled);const a=els[0],z=els.at(-1);if(e.shiftKey&&document.activeElement===a){z?.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===z){a?.focus();e.preventDefault();}}
 if(e.key==='Escape')closeAdminMobileSidebar();
});


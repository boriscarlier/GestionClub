
(function(){
 'use strict';
 const app=document.getElementById('intranetApp'),side=app.querySelector('.sidebar'),main=app.querySelector('.intra-main'),trigger=document.querySelector('.admin-mobile-menu-btn');
 const visible=e=>!e.disabled&&e.getClientRects().length>0;
 const focusables=()=>Array.from(side.querySelectorAll('button,a[href],input,select,[tabindex="0"]')).filter(visible);
 let opener=null;
 function syncMenu(){
  const mobile=window.innerWidth<=1024,open=mobile&&side.classList.contains('mobile-open');
  side.inert=mobile&&!open;
  if(main)main.inert=open;
  if(trigger){trigger.setAttribute('aria-controls',side.id);trigger.setAttribute('aria-expanded',String(open));}
 }
 side.id=side.id||'adminNavigation';side.setAttribute('aria-label','Navigation Administration');
 const previousToggle=window.toggleAdminMobileSidebar,previousClose=window.closeAdminMobileSidebar;
 window.toggleAdminMobileSidebar=function(force){
  const wasOpen=side.classList.contains('mobile-open');
  previousToggle(force);syncMenu();
  if(side.classList.contains('mobile-open')){if(!wasOpen)opener=document.activeElement;focusables()[0]?.focus();}
  else if(wasOpen)(opener||trigger)?.focus();
 };
 window.closeAdminMobileSidebar=function(){
  const wasOpen=side.classList.contains('mobile-open');previousClose();syncMenu();
  if(wasOpen)(opener||trigger)?.focus();
 };
 document.addEventListener('keydown',event=>{
  if(!side.classList.contains('mobile-open')||window.innerWidth>1024)return;
  if(event.key==='Escape'){event.preventDefault();window.closeAdminMobileSidebar();return;}
  if(event.key!=='Tab')return;
  const items=focusables(),first=items[0],last=items.at(-1);
  if(!first)return;
  if(event.shiftKey&&(document.activeElement===first||!side.contains(document.activeElement))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(document.activeElement===last||!side.contains(document.activeElement))){event.preventDefault();first.focus();}
 });
 window.addEventListener('resize',()=>{if(window.innerWidth>1024)window.closeAdminMobileSidebar();else syncMenu();});
 const previousGo=window.goTo;
 window.goTo=function(target){
  const result=previousGo.apply(this,arguments);
  if(result!==false&&document.getElementById(target)?.classList.contains('active')){
   app.querySelectorAll('.nav button[data-page]').forEach(b=>{if(b.classList.contains('active'))b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
   const title=document.getElementById('pageTitle');title.tabIndex=-1;title.focus();
  }
  return result;
 };
 const tabs=Array.from(document.querySelectorAll('[data-fcu-tab]'));
 const oldTab=window.fclcFootclubs.tab;
 function syncTabs(){tabs.forEach(b=>{const selected=b.getAttribute('aria-pressed')==='true';b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;});}
 tabs.forEach(b=>{
  const key=b.dataset.fcuTab,pane=document.querySelector('[data-fcu-pane="'+key+'"]');
  b.id='fcuTab-'+key;b.setAttribute('role','tab');b.setAttribute('aria-controls','fcuPane-'+key);
  pane.id='fcuPane-'+key;pane.setAttribute('role','tabpanel');pane.setAttribute('aria-labelledby',b.id);pane.tabIndex=0;
  b.addEventListener('click',syncTabs);
  b.addEventListener('keydown',event=>{
   let index=tabs.indexOf(b);
   if(event.key==='ArrowRight')index=(index+1)%tabs.length;
   else if(event.key==='ArrowLeft')index=(index+tabs.length-1)%tabs.length;
   else if(event.key==='Home')index=0;
   else if(event.key==='End')index=tabs.length-1;
   else return;
   event.preventDefault();oldTab(tabs[index].dataset.fcuTab);syncTabs();tabs[index].focus();
  });
 });
 document.querySelector('.fcu-tabs').setAttribute('role','tablist');
 for(const id of ['fcuStatus','fcuSelectionStatus']){const e=document.getElementById(id);if(e){e.setAttribute('role','status');e.setAttribute('aria-live','polite');}}
 syncTabs();syncMenu();
})();


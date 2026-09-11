function toggleCoachMobileMore(force){
 const sheet=document.getElementById('coachMobileMoreSheet'),shade=document.getElementById('coachMobileMoreBackdrop');if(!sheet||!shade)return;
 const open=(typeof force==='boolean'?force:!sheet.classList.contains('open'))&&innerWidth<=1024&&qaSpace==='coach';
 if(open)qaLastMenuFocus=document.activeElement;
 sheet.classList.toggle('open',open);shade.classList.toggle('open',open);
 sheet.hidden=!open;sheet.inert=!open;shade.hidden=!open;
 sheet.setAttribute('aria-hidden',String(!open));sheet.setAttribute('role','dialog');sheet.setAttribute('aria-modal','true');
 document.querySelectorAll('.coach-mobile-more-trigger,[data-coach-mobile-page="more"]').forEach(b=>b.setAttribute('aria-expanded',String(open)));
 document.body.classList.toggle('coach-mobile-sheet-open',open);
 if(open)sheet.querySelector('button')?.focus({preventScroll:true});
 else if(sheet.contains(document.activeElement)&&qaLastMenuFocus?.isConnected)qaLastMenuFocus.focus({preventScroll:true});
}

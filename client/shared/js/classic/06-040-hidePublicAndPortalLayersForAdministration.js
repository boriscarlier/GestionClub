function hidePublicAndPortalLayersForAdministration(){
 qaSetSpace('admin');
 document.querySelectorAll('.public-page').forEach(e=>{e.classList.remove('active');e.style.pointerEvents='none';});
 ['coachApp','coachLogin','portalApp','portalLogin','sharedPublicFooter'].forEach(id=>{const e=document.getElementById(id);if(e&&id!=='sharedPublicFooter')e.style.display='none';});
 closeMobileMenu();toggleCoachMobileMore(false);
}


function enhanceMatchCardsWithClubLogo(root=document){
 const selectors=['.match-card','.portal-match','.coach-match','.fixture'];
 selectors.forEach(sel=>{
  root.querySelectorAll(sel).forEach(card=>{
   if(card.dataset.clubLogoEnhanced==='1') return;
   const strong=card.querySelector('strong');
   if(!strong) return;
   const wrapper=document.createElement('div');
   wrapper.className='match-with-logo';
   const img=document.createElement('img');
   img.className='club-logo-img club-logo-sm';
   img.setAttribute('data-club-logo','');
   img.alt='Logo CLUB EXEMPLE';
   const copy=document.createElement('div');
   copy.className='match-copy';
   strong.parentNode.insertBefore(wrapper,strong);
   wrapper.appendChild(img);
   wrapper.appendChild(copy);
   copy.appendChild(strong);
   // Move the immediately following tiny info into copy when possible.
   const next=wrapper.nextElementSibling;
   if(next && next.classList.contains('tiny')) copy.appendChild(next);
   card.dataset.clubLogoEnhanced='1';
  });
 });
 applyClubLogoAssets(root);
}


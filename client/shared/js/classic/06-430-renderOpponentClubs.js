function renderOpponentClubs(){
 const grid=document.getElementById('opponentClubGrid');
 if(!grid)return;

 refreshOpponentMatchOptions();

 const q=norm(document.getElementById('oppClubSearch')?.value||'');
 const saved=[...(state.opponents||[])];

 const missing=opponentNamesFromMatches()
  .filter(name=>!findOpponentClub(name))
  .map(name=>({id:'missing:'+opponentKey(name),name,city:'',color:'',logo:'',_missing:true}));

 const arr=[...saved,...missing]
  .filter(o=>!q||norm(`${o.name} ${o.city}`).includes(q))
  .sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'fr'));

 const matchNames=opponentNamesFromMatches();
 const withLogo=saved.filter(o=>!!o.logo).length;
 const missingCount=matchNames.filter(n=>!findOpponentClub(n)||!findOpponentClub(n)?.logo).length;

 const stat1=document.getElementById('oppStatMatchClubs');
 const stat2=document.getElementById('oppStatSaved');
 const stat3=document.getElementById('oppStatWithLogo');
 const stat4=document.getElementById('oppStatMissing');
 if(stat1)stat1.textContent=matchNames.length;
 if(stat2)stat2.textContent=saved.length;
 if(stat3)stat3.textContent=withLogo;
 if(stat4)stat4.textContent=missingCount;

 grid.innerHTML=arr.length?arr.map(o=>{
  const presence=opponentMatchPresence(o.name);
  const linked=presence.linked;
  const safeName=encodeURIComponent(o.name||'');
  return `<div class="opponent-card ${linked?'matched':'unmatched'}" data-opponent-id="${o._missing?'':o.id}" data-opponent-name="${safeName}" data-missing="${o._missing?'1':'0'}">
   ${o.logo
     ? `<img class="opponent-logo" src="${o.logo}" alt="Logo ${o.name}">`
     : `<div class="opponent-logo-placeholder">${(o.name||'ADV').slice(0,3).toUpperCase()}</div>`}
   <div>
    <strong>${o.name}</strong>
    <div class="tiny">${o.city||'Ville non renseignée'}</div>
    <div class="opponent-status-row">
     ${linked?`<span class="badge green">Correspondance matchs</span>`:`<span class="badge yellow">Absent des matchs</span>`}
     ${o.logo?`<span class="badge green">Logo enregistré</span>`:`<span class="badge yellow">Logo manquant</span>`}
    </div>
    <div class="opponent-match-count">${presence.count} match${presence.count>1?'s':''} associé${presence.count>1?'s':''}</div>
    <div class="opponent-actions">
     <button type="button" class="secondary opponent-logo-btn">🔎 Logo Internet</button>
     ${o._missing
       ? `<button type="button" class="primary opponent-create-btn">Créer la fiche</button>`
       : `<button type="button" class="ghost opponent-open-btn">Ouvrir la fiche</button>
          <button type="button" class="ghost opponent-edit-btn">Modifier</button>
          <button type="button" class="ghost opponent-delete-btn">Supprimer</button>`}
    </div>
   </div>
  </div>`;
 }).join('')
  : '<div class="tiny">Aucun club adverse enregistré ou détecté dans les matchs.</div>';

 grid.querySelectorAll('.opponent-card').forEach(card=>{
  const isMissing=card.dataset.missing==='1';
  const id=card.dataset.opponentId||'';
  const name=decodeURIComponent(card.dataset.opponentName||'');

  card.addEventListener('click',e=>{
   if(e.target.closest('button'))return;
   if(isMissing)createAndOpenOpponent(name);
   else openOpponentDetail(id);
  });

  card.querySelector('.opponent-create-btn')?.addEventListener('click',e=>{
   e.stopPropagation();
   createAndOpenOpponent(name);
  });
  card.querySelector('.opponent-open-btn')?.addEventListener('click',e=>{
   e.stopPropagation();
   openOpponentDetail(id);
  });
  card.querySelector('.opponent-edit-btn')?.addEventListener('click',e=>{
   e.stopPropagation();
   editOpponentClub(id);
  });
  card.querySelector('.opponent-delete-btn')?.addEventListener('click',e=>{
   e.stopPropagation();
   deleteOpponentClub(id);
  });
  card.querySelector('.opponent-logo-btn')?.addEventListener('click',e=>{
   e.stopPropagation();
   if(isMissing){
    const o=createOpponentFromMatchName(name);
    if(o)prepareOpponentWebSearch(o.id);
   }else{
    prepareOpponentWebSearch(id);
   }
  });
 });
}

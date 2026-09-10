function renderOpponentDetail(){
 const o=opponentById(currentOpponentId);
 if(!o)return;

 const presence=opponentMatchPresence(o.name);
 const title=document.getElementById('opponentDetailTitle');
 const name=document.getElementById('opponentDetailName');
 const city=document.getElementById('opponentDetailCity');
 const logo=document.getElementById('opponentDetailLogo');
 const badges=document.getElementById('opponentDetailBadges');
 if(title)title.textContent=o.name||'Club adverse';
 if(name)name.textContent=o.name||'Club adverse';
 if(city)city.textContent=o.city||'Ville non renseignée';
 if(logo)logo.innerHTML=o.logo
  ? `<img class="opponent-detail-logo" src="${o.logo}" alt="Logo ${o.name}">`
  : `<div class="opponent-detail-placeholder">${(o.name||'ADV').slice(0,3).toUpperCase()}</div>`;
 if(badges)badges.innerHTML=
  `<span class="badge ${presence.linked?'green':'yellow'}">${presence.linked?'Correspondance matchs':'Absent des matchs'}</span>`+
  `<span class="badge ${o.logo?'green':'yellow'}">${o.logo?'Logo enregistré':'Logo manquant'}</span>`;

 const grid=document.getElementById('opponentDetailGrid');
 if(grid)grid.innerHTML=[
  opponentDetailField('Nom exact dans les matchs',o.name),
  opponentDetailField('Ville',o.city),
  opponentDetailField('Couleur',o.color),
  opponentDetailField('Nombre de matchs associés',presence.count),
  opponentDetailField('Identifiant fiche',o.id),
  opponentDetailField('Logo',o.logo?'Enregistré':'À compléter'),
  ...(o.fff?[
   opponentDetailField('N° affiliation',o.fff.affiliation),
   opponentDetailField('Couleurs',o.fff.colors||o.color),
   opponentDetailField('Niveau',o.fff.level),
   opponentDetailField('Adresse',o.fff.address),
   opponentDetailField('Téléphone',o.fff.phone||o.fff.phones?.[0]||'Téléphone manquant'),
   opponentDetailField('Email',o.fff.officialEmail),
   opponentDetailField('Président',o.fff.president),
   opponentDetailField('Correspondant',o.fff.correspondent),
   opponentDetailField('Stade',o.fff.venueName)
  ]:[])
 ].join('');

 const matches=(state.matches||[])
  .filter(m=>opponentKey(m.opponent||m.opponentClub)===opponentKey(o.name))
  .sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
 const box=document.getElementById('opponentDetailMatches');
 if(box)box.innerHTML=matches.length?matches.map(m=>`
  <div class="opponent-match-item" onclick="openMatchDetail('${m.id}')">
   <strong>${formatMatchDateFr(m.date)} — ${m.team||'FC LA COUR'} vs ${m.opponent||o.name}</strong>
   <div class="tiny">${m.time||'—'} • ${m.place||'—'} • ${matchStatusValue(m)}</div>
  </div>`).join(''):'<div class="tiny">Aucun match associé.</div>';
}

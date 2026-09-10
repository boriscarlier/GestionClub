function opponentLogoHtml(name,cls='public-opponent-logo'){
 const o=findOpponentClub(name);
 if(o?.logo)return `<img class="${cls}" src="${o.logo}" alt="Logo ${o.name}">`;
 const initials=(name||'ADV').slice(0,3).toUpperCase();
 return `<div class="opponent-logo-placeholder" style="width:48px;height:48px">${initials}</div>`;
}




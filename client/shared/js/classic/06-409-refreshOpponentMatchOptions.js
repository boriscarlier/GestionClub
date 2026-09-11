function refreshOpponentMatchOptions(){
 const select=document.getElementById('oppMatchClubSelect');
 if(!select)return;
 const current=select.value;
 const names=opponentNamesFromMatches();
 select.innerHTML='<option value="">Choisir un adversaire...</option>'+
  names.map(n=>`<option value="${n.replace(/"/g,'&quot;')}" ${n===current?'selected':''}>${n}</option>`).join('');
}

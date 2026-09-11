function prepareOpponentWebSearch(id){
 const o=(state.opponents||[]).find(x=>x.id===id);
 if(!o)return;
 document.getElementById('oppClubName').value=o.name||'';
 document.getElementById('oppClubCity').value=o.city||'';
 document.getElementById('oppClubColor').value=o.color||'';
 document.getElementById('oppClubLogoUrl').value='';
 document.getElementById('oppWebLogoPreview').innerHTML='';
 opponentLogoDraft=o.logo||'';
 searchOpponentLogoOnWeb();
 document.getElementById('oppClubLogoUrl')?.focus();
}

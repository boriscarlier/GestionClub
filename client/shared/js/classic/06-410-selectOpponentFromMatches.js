function selectOpponentFromMatches(name){
 if(!name)return;
 const input=document.getElementById('oppClubName');
 if(input)input.value=name;

 const existing=findOpponentClub(name);
 if(existing){
  document.getElementById('oppClubCity').value=existing.city||'';
  document.getElementById('oppClubColor').value=existing.color||'';
  opponentLogoDraft=existing.logo||'';
  document.getElementById('oppClubLogoUrl').value=existing.logo&&/^https?:/i.test(existing.logo)?existing.logo:'';
  const box=document.getElementById('oppLogoPreview');
  if(box)box.innerHTML=existing.logo
    ? `<img src="${existing.logo}" alt="Logo ${existing.name}" style="width:60px;height:60px;object-fit:contain;background:#fff;border-radius:10px;padding:4px"><div class="tiny">Logo déjà enregistré.</div>`
    : '<div class="tiny">Club déjà enregistré, mais sans logo.</div>';
 }else{
  document.getElementById('oppClubCity').value='';
  document.getElementById('oppClubColor').value='';
  document.getElementById('oppClubLogoUrl').value='';
 document.getElementById('oppMatchClubSelect').value='';
  document.getElementById('oppLogoPreview').innerHTML='<div class="tiny">Nouvel adversaire détecté dans les matchs.</div>';
  document.getElementById('oppWebLogoPreview').innerHTML='';
  opponentLogoDraft='';
 }
}

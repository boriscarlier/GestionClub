function previewOpponentLogoUrl(){
 const input=document.getElementById('oppClubLogoUrl');
 const box=document.getElementById('oppWebLogoPreview');
 if(!input||!box)return;
 const url=input.value.trim();
 if(!url){box.innerHTML='';return;}

 try{
  const parsed=new URL(url);
  if(!/^https?:$/.test(parsed.protocol))throw new Error('protocol');
 }catch(e){
  box.innerHTML='<div class="tiny">URL invalide.</div>';
  return;
 }

 box.innerHTML=`<div class="logo-web-preview">
  <img id="oppWebPreviewImg" src="${url}" alt="Aperçu logo trouvé"
       onload="opponentLogoDraft='${url.replace(/'/g,"\\'")}'"
       onerror="this.parentElement.innerHTML='<div class=&quot;tiny&quot;>Impossible de charger cette image directement. Essayez une autre URL ou téléchargez le fichier.</div>'">
  <div>
   <strong>Aperçu du logo Internet</strong>
   <div class="logo-source">${url}</div>
   <button class="primary" style="margin-top:8px" onclick="useOpponentLogoUrl()">Utiliser ce logo</button>
  </div>
 </div>`;
}

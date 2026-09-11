function previewOpponentLogo(event){
 const file=event.target.files?.[0];
 if(!file){opponentLogoDraft='';return;}
 if(file.size>1024*1024){
  toast('Logo','Image trop lourde. Maximum conseillé : 1 Mo.');
  event.target.value='';
  return;
 }
 const reader=new FileReader();
 reader.onload=()=>{
  opponentLogoDraft=String(reader.result||'');
  const box=document.getElementById('oppLogoPreview');
  if(box)box.innerHTML=`<img src="${opponentLogoDraft}" alt="Aperçu logo" style="width:60px;height:60px;object-fit:contain;background:#fff;border-radius:10px;padding:4px">`;
 };
 reader.readAsDataURL(file);
}




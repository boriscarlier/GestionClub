function drawClubLogoOnCanvas(x,y,size){
 const img=preloadClubLogo();
 if(img && img.complete && img.naturalWidth){
  try{ctx.drawImage(img,x,y,size,size)}catch(e){console.error('Logo canvas',e)}
 }
}


let currentAdminTeamId=null;


function preloadClubLogo(){
 if(__clubLogoImage) return __clubLogoImage;
 const img=new Image();
 img.src=CLUB_LOGO_DATA_URI;
 img.onload=()=>{
  applyClubLogoAssets(document);
  if(typeof generateVisual==='function'){
   try{generateVisual()}catch(e){console.error('Logo visual refresh',e)}
  }
 };
 __clubLogoImage=img;
 return img;
}


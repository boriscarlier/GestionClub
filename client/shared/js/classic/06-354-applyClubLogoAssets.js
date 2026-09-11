function applyClubLogoAssets(root=document){
 root.querySelectorAll('[data-club-logo]').forEach(img=>{
  if(img.src!==CLUB_LOGO_DATA_URI) img.src=CLUB_LOGO_DATA_URI;
 });
}


function exportVisual(){
 const a=document.createElement('a');
 a.download=`GESTION_CLUB_${currentVisualTemplate}_${currentVisualFormat}.png`;
 a.href=canvas.toDataURL('image/png');
 a.click();
}

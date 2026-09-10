function exportVisual(){
 const a=document.createElement('a');
 a.download=`FC_LA_COUR_${currentVisualTemplate}_${currentVisualFormat}.png`;
 a.href=canvas.toDataURL('image/png');
 a.click();
}

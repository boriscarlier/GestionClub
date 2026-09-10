function visualBase(){
 const size=visualSizes[currentVisualFormat];
 canvas.width=size[0]; canvas.height=size[1];
 const w=canvas.width, h=canvas.height;
 ctx.fillStyle='#09100b'; ctx.fillRect(0,0,w,h);
 const g=ctx.createRadialGradient(w*0.78,h*0.18,20,w*0.78,h*0.18,w*0.75);
 g.addColorStop(0,'rgba(57,211,83,.25)'); g.addColorStop(1,'rgba(57,211,83,0)');
 ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
 ['#111','#39d353','#f3c842','#ef4444'].forEach((c,i)=>{ctx.fillStyle=c;ctx.fillRect(i*w/4,0,w/4,Math.max(18,Math.round(h*0.015)));});
 drawClubLogoOnCanvas(w*0.055,h*0.035,Math.round(Math.min(w,h)*0.13));
 ctx.fillStyle='#fff';
 ctx.font=`800 ${Math.round(w*0.032)}px Arial`;
 ctx.textAlign='left';
 ctx.fillText('FC LA COUR',w*0.22,h*0.095);
}


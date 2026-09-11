function centerText(text,y,size,color,weight){
 ctx.fillStyle=color||'#fff';
 ctx.font=`${weight||800} ${size}px Arial`;
 ctx.textAlign='center';
 ctx.fillText(text,canvas.width/2,y);
}


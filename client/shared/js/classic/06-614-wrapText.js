function wrapText(text,x,y,maxWidth,lineHeight,font,color,align){
 if(!text) return;
 ctx.font=font;
 ctx.fillStyle=color||'#fff';
 ctx.textAlign=align||'center';
 const words=String(text).split(' ');
 let line='', lines=[];
 for(let n=0;n<words.length;n++){
  const testLine=line+words[n]+' ';
  const testWidth=ctx.measureText(testLine).width;
  if(testWidth>maxWidth && n>0){ lines.push(line.trim()); line=words[n]+' '; }
  else{ line=testLine; }
 }
 lines.push(line.trim());
 lines.forEach((ln,i)=>ctx.fillText(ln,x,y+i*lineHeight));
}


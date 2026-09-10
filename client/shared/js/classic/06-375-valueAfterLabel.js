function valueAfterLabel(lines,labelRegex){
 for(let i=0;i<lines.length;i++){
  if(labelRegex.test(lines[i])){
   const same=lines[i].replace(labelRegex,'').replace(/^[:\s]+/,'').trim();
   if(same)return same;
   for(let j=i+1;j<Math.min(lines.length,i+4);j++){
    if(lines[j] && !/:$/.test(lines[j])) return lines[j];
   }
  }
 }
 return '';
}


function firstFffMatch(text,patterns){
 for(const p of patterns){
  const m=text.match(p);
  if(m&&m[1])return cleanFffValue(m[1]);
 }
 return '';
}

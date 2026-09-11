function headerValue(row,headers,names){
 for(const name of names){
  const i=headers.findIndex(h=>norm(h)===norm(name));
  if(i>=0)return row[i]??'';
 }
 return '';
}

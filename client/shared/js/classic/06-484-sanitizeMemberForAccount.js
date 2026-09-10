function sanitizeMemberForAccount(member,account){
 const out={...member};
 Object.entries(SENSITIVE_FIELDS).forEach(([group,fields])=>{
  if(accountCanSeeSensitive(account,group))return;
  fields.forEach(f=>{if(f in out)out[f]='Accès restreint'});
 });
 return out;
}


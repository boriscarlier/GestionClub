function load(){
 let raw;
 try{
  raw=localStorage.getItem(KEY);if(!raw)return JSON.parse(JSON.stringify(defaults));
  const parsed=JSON.parse(raw);
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new Error('Format de base locale invalide.');
  for(const key of ['members','teams','matches','discipline','accounts'])if(parsed[key]!==undefined&&!Array.isArray(parsed[key]))throw new Error('Collection invalide : '+key);
  return parsed;
 }catch(e){
  if(raw){try{localStorage.setItem('fclc_recovery_corrupt_state',raw);}catch(err){throw new Error('Base locale illisible ; sauvegarde de secours impossible. Aucune réinitialisation effectuée.');}}
  return JSON.parse(JSON.stringify(defaults));
 }
}

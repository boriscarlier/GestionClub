function restoreLastImportResetBackup(){
 try{
  const raw=localStorage.getItem('gestionclub_last_import_reset_backup');
  if(!raw)return toast('Restauration','Aucune sauvegarde interne disponible.');
  const payload=JSON.parse(raw);
  const d=payload?.data||{};
  state.members=Array.isArray(d.members)?d.members:[];
  state.matches=Array.isArray(d.matches)?d.matches:[];
  state.discipline=Array.isArray(d.discipline)?d.discipline:[];
  state.opponents=Array.isArray(d.opponents)?d.opponents:[];
  state.importRegistry=d.importRegistry||{};
  state.importHistory=Array.isArray(d.importHistory)?d.importHistory:[];
  state.reimportMode={active:false,restoredAt:new Date().toISOString()};
  localStorage.setItem(KEY,JSON.stringify(state));
  try{renderAll()}catch(e){console.error(e)}
  toast('Restauration','Dernière sauvegarde avant réinitialisation restaurée.');
 }catch(err){
  console.error(err);
  toast('Restauration','Impossible de restaurer la sauvegarde.');
 }
}


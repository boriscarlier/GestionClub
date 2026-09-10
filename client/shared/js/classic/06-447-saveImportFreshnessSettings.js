function saveImportFreshnessSettings(){
 if(!state.importFreshness)state.importFreshness={};
 const fields={
  members:'freshMembers',
  matches:'freshMatches',
  discipline:'freshDiscipline',
  opponents:'freshOpponents',
  clubprofile:'freshClubProfile'
 };
 Object.entries(fields).forEach(([k,id])=>{
  const v=Math.max(1,Number(document.getElementById(id)?.value||1));
  state.importFreshness[k]=v;
 });
 localStorage.setItem(KEY,JSON.stringify(state));
 renderImportWatch();
 if(typeof renderAlertCenter==='function')renderAlertCenter();
}

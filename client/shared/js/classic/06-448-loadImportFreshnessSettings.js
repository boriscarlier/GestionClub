function loadImportFreshnessSettings(){
 const cfg=state.importFreshness||{};
 const map={members:'freshMembers',matches:'freshMatches',discipline:'freshDiscipline',opponents:'freshOpponents',clubprofile:'freshClubProfile'};
 Object.entries(map).forEach(([k,id])=>{
  const el=document.getElementById(id);
  if(el)el.value=cfg[k]||{members:30,matches:14,discipline:14,opponents:90,clubprofile:180}[k];
 });
}


let unifiedSpecialFile=null;
let unifiedSpecialPrepared=false;


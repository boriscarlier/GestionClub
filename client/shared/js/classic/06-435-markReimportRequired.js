function markReimportRequired(){
 if(!state.importRegistry)state.importRegistry={};
 Object.keys(IMPORT_SOURCE_DEFS).forEach(type=>{
  state.importRegistry[type]={
   type,
   filename:'Réimportation requise',
   importedAt:null,
   itemCount:0,
   source:'Réinitialisation manuelle',
   note:'Base réinitialisée — nouvel import requis',
   reimportRequired:true,
   updatedAt:new Date().toISOString()
  };
 });
 state.reimportMode={
  active:true,
  startedAt:new Date().toISOString(),
  order:['members','matches','discipline','opponents']
 };
}

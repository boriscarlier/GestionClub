function openPlanningEditorSafe(id){
 const ev=(state.planning||[]).find(e=>String(e.id)===String(id));
 if(!ev)return toast('Planning','Événement introuvable.');
 openPlanningEditor(ev.id);
}

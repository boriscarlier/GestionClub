function openPlanningEditor(id=''){
 if(!currentAdminCan('teams','edit'))return toast('Accès refusé','Modification du planning non autorisée.');
 const box=document.getElementById('planningEventEditor');if(!box)return;
 const ev=id?(state.planning||[]).find(e=>String(e.id)===String(id)):null;
 document.getElementById('planningEditId').value=ev?.id||'';
 document.getElementById('planningEditorTitle').textContent=ev?'Modifier le planning':'Ajouter au planning';
 document.getElementById('planningEditDay').value=String(ev?.day??0);
 document.getElementById('planningEditTime').value=ev?.time||'18:00';
 document.getElementById('planningEditDuration').value=Number(ev?.duration||90);
 document.getElementById('planningEditType').value=ev?.type||'training';
 fillPlanningEditorTeams(ev?.team||'Club');
 document.getElementById('planningEditPlace').value=ev?.place||'Stade des Jacques';
 document.getElementById('planningEditTitle').value=ev?.title||'';
 document.getElementById('planningDeleteBtn').style.display=ev?'':'none';
 box.classList.add('show');
}

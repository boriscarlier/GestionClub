function renderMemberBlockButtons(){
 document.querySelectorAll('#memberdetail .member-block-edit-btn').forEach(btn=>{
  const block=btn.dataset.memberEdit;
  btn.textContent=memberBlockEditState.has(block)?'Annuler':'Modifier';
  btn.classList.toggle('secondary',memberBlockEditState.has(block));
 });
}

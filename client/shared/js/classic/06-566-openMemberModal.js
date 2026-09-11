function openMemberModal(){
 if(!currentAdminCan('members','create')){
  toast('Accès refusé','Vous n’avez pas l’autorisation d’ajouter un licencié.');
  return;
 }
 const modal=document.getElementById('memberModal');
 if(!modal)return;
 const category=document.getElementById('mCategory');
 if(category && !category.options.length){
  category.innerHTML=(state.teams||[]).map(t=>`<option>${escapeHtml(t.name)}</option>`).join('');
 }
 modal.classList.add('show');
 modal.setAttribute('aria-hidden','false');
}

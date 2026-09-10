async function openMemberDetail(id,event){
 if(event&&event.target&&event.target.closest('input,button,a'))return;
 currentMemberId=id;
 memberBlockEditState.clear();
 try{
  await ensureServerMemberDetail(id);
  goTo('memberdetail');
  renderMemberDetail();
 }catch(err){
  console.error('Erreur fiche licencié',err);
  toast('Fiche licencié','Erreur : '+(err.message||err));
 }
}


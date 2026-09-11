function toggleMemberBlockEdit(block){
 if(!qaCanEditBlock(block))return toast('Accès refusé','Modification des licenciés non autorisée.');
 qaCaptureMemberDrafts();
 if(memberBlockEditState.has(block))memberBlockEditState.delete(block);
 else memberBlockEditState.add(block);
 renderMemberDetail();
}

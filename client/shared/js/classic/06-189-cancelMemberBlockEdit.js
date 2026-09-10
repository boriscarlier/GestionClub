function cancelMemberBlockEdit(block){
 memberBlockEditState.delete(block);delete qaMemberDrafts[block];
 renderMemberDetail();
}

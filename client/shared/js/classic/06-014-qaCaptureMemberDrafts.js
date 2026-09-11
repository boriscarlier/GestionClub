function qaCaptureMemberDrafts(){
 if(qaDraftOwner!==currentMemberId){Object.keys(qaMemberDrafts).forEach(k=>delete qaMemberDrafts[k]);qaDraftOwner=currentMemberId;return;}
 const blocks={identity:'memberIdentityBlock',contact:'memberContactBlock',finance:'memberFinanceBlock',license:'memberLicensesBlock',guardian:'memberGuardianBlock',discipline:'memberDisciplineBlock'};
 memberBlockEditState.forEach(block=>{
  const root=document.getElementById(blocks[block]);if(!root)return;
  const inputs=[...root.querySelectorAll('input[id],select[id],textarea[id]')];
  if(inputs.length)qaMemberDrafts[block]=Object.fromEntries(inputs.map(e=>[e.id,e.value]));
 });
}


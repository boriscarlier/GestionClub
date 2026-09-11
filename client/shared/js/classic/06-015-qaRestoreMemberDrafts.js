function qaRestoreMemberDrafts(){
 Object.entries(qaMemberDrafts).forEach(([block,values])=>{if(memberBlockEditState.has(block))Object.entries(values).forEach(([id,value])=>{const e=document.getElementById(id);if(e)e.value=value;});});
 document.querySelectorAll('#memberdetail .member-block-edit-btn').forEach(b=>b.style.display=qaCanEditBlock(b.dataset.memberEdit)?'':'none');
}


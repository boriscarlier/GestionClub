function saveMemberMutationInfo(){
 const m=(state.members||[]).find(x=>x.id===currentMemberId);if(!m)return;
 if(!qaCanEditBlock('identity'))return toast('Accès refusé','Vérification non autorisée.');
 const infoBefore=memberMutationInfo(m);

 if(infoBefore.verifiedByDefault){
  m.mutationVerificationMode='automatic';
  m.mutationVerified=true;
  m.mutationVerifiedAt=m.mutationVerifiedAt||new Date().toISOString();
  localStorage.setItem(KEY,JSON.stringify(state));
  renderMemberMutationInfo(m);
  return;
 }

 if(!currentAdminCan('members','edit')){
  toast('Accès refusé','Modification de la vérification mutation non autorisée.');
  renderMemberMutationInfo(m);
  return;
 }

 const verification=document.getElementById('memberMutationVerified')?.value||'pending';
 m.mutationVerificationMode='manual';
 m.mutationVerificationFingerprint=qaMutationSignature(m);
 m.mutationVerified=verification==='verified';
 m.mutationVerifiedAt=m.mutationVerified?new Date().toISOString():'';
 m.updatedAt=new Date().toISOString();
 localStorage.setItem(KEY,JSON.stringify(state));

 const info=memberMutationInfo(m);
 if(typeof logAdminAction==='function'){
  logAdminAction('Licenciés','Vérification cachet',`${m.last||''} ${m.first||''} • ${info.code||'sans code'} • ${info.label||'sans libellé'} • ${verification}`);
 }

 renderMemberDetail();
 if(typeof renderRegulatoryChecks==='function')renderRegulatoryChecks();
 toast('Cachet licence',m.mutationVerified?'Cachet marqué vérifié.':'Cachet remis à vérifier.');
}


const memberBlockEditState=new Set();


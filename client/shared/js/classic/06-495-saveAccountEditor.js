function saveAccountEditor(){
 if(!currentAdminCan('accounts',currentAccountId?'edit':'create'))return toast('Accès refusé','Gestion des comptes non autorisée.');
 const editingId=currentAccountId;
 const isEdit=!!editingId;
 const first=document.getElementById('accFirst')?.value.trim()||'';
 const last=document.getElementById('accLast')?.value.trim()||'';
 const email=document.getElementById('accEmail')?.value.trim()||'';
 const fn=document.getElementById('accFunction')?.value.trim()||'';
 const status=document.getElementById('accStatus')?.value||'active';
 const memberId=document.getElementById('accMemberLink')?.value||'';
 const note=document.getElementById('accNote')?.value.trim()||'';
 const roles=[...(document.getElementById('accRoles')?.selectedOptions||[])].map(o=>o.value);
 const scope={
  type:document.getElementById('accScopeType')?.value||'club',
  teams:[...(document.getElementById('accScopeTeams')?.selectedOptions||[])].map(o=>o.value)
 };

 if(!email){
  toast('Comptes','L’adresse email est obligatoire.');
  return;
 }
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
  toast('Comptes','L’adresse email n’est pas valide.');
  return;
 }
 const duplicate=(state.accounts||[]).find(a=>norm(a.email)===norm(email)&&a.id!==editingId);
 if(duplicate){
  toast('Comptes','Un compte existe déjà avec cette adresse email.');
  return;
 }
 if(status==='active'&&!roles.length){
  toast('Comptes','Un compte actif doit avoir au moins un rôle.');
  return;
 }
 if(['team','category'].includes(scope.type)&&!scope.teams.length){
  toast('Comptes','Sélectionnez au moins une équipe ou catégorie pour ce périmètre.');
  return;
 }

 if(isEdit&&qaLastAdministratorRemoval(editingId,status,roles))return toast('Comptes','Conservez au moins un administrateur actif.');
 let a=isEdit?accountById(editingId):null;
 if(a){
  Object.assign(a,{first,last,email,function:fn,status,memberId,note,roles,scope,updatedAt:new Date().toISOString()});
 }else{
  a={
   id:uid('acc'),first,last,email,function:fn,status,memberId,note,roles,scope,
   createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),lastLoginAt:null
  };
  state.accounts.push(a);
 }

 localStorage.setItem(KEY,JSON.stringify(state));
 logAdminAction('Comptes',isEdit?'Modification':'Création',email);

 closeAccountEditor();
 renderAccounts();

 if(isEdit){
  currentAccountId=editingId;
  if(document.getElementById('accountdetail')?.classList.contains('active'))renderAccountDetail();
 }
 if(typeof renderAccessAdmin==='function')renderAccessAdmin();
 if(typeof renderAccessAudit==='function')renderAccessAudit();

 toast('Comptes',isEdit?'Compte modifié.':'Compte créé.');
}

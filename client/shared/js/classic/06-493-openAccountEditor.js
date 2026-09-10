function openAccountEditor(id=null){
 if(!currentAdminCan('accounts',id?'edit':'create'))return toast('Accès refusé','Gestion des comptes non autorisée.');
 currentAccountId=id;
 const a=id?accountById(id):null;
 const modal=document.getElementById('accountModal');if(!modal)return;
 document.getElementById('accountModalTitle').textContent=a?'Modifier le compte':'Nouveau compte';
 document.getElementById('accFirst').value=a?.first||'';
 document.getElementById('accLast').value=a?.last||'';
 document.getElementById('accEmail').value=a?.email||'';
 document.getElementById('accFunction').value=a?.function||'';
 document.getElementById('accStatus').value=a?.status||'active';
 document.getElementById('accNote').value=a?.note||'';
 populateAccountMemberSelect(a?.memberId||'');
 populateAccountRoles(a?.roles||[]);
 populateAccountScope(a);
 modal.classList.add('show');
 modal.setAttribute('aria-hidden','false');
}

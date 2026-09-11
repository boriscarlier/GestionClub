function toggleAccountStatus(id){
 if(!currentAdminCan('accounts','edit'))return toast('Accès refusé','Gestion des comptes non autorisée.');
 const a=accountById(id);if(!a)return;
 const reactivating=a.status==='disabled';
 if(!reactivating&&qaLastAdministratorRemoval(id,'disabled',a.roles))return toast('Comptes','Le dernier administrateur ne peut pas être désactivé.');
 if(reactivating){
  if(!(a.roles||[]).length){toast('Comptes','Impossible de réactiver : aucun rôle n’est attribué.');return;}
  if(!a.scope?.type){toast('Comptes','Impossible de réactiver : périmètre non défini.');return;}
 }
 a.status=reactivating?'active':'disabled';
 a.updatedAt=new Date().toISOString();
 localStorage.setItem(KEY,JSON.stringify(state));
 logAdminAction('Comptes',a.status==='disabled'?'Désactivation':'Réactivation',a.email);
 renderAccounts();
 if(currentAccountId===id&&document.getElementById('accountdetail')?.classList.contains('active'))renderAccountDetail();
 if(typeof renderAccessAdmin==='function')renderAccessAdmin();
 if(typeof renderAccessAudit==='function')renderAccessAudit();
 toast('Comptes',a.status==='disabled'?'Compte désactivé.':'Compte réactivé.');
}

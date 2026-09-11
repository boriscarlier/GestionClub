function updateMemberDataSource(){
 const node=document.getElementById('memberDataSource');if(!node)return;
 if(!serverMembersEnabled()){node.textContent='Source : base locale';return;}
 if(serverMembersState.loading){node.textContent='Source : serveur SQL/API · chargement...';return;}
 if(serverMembersState.error){node.textContent='Source : base locale · serveur indisponible : '+serverMembersState.error;return;}
 if(serverMembersState.loaded){node.textContent='Source : serveur SQL/API · révision '+(serverMembersState.revision||'—')+' · '+serverMembersState.total+' licencié(s)';return;}
 node.textContent='Source : serveur SQL/API · en attente';
}

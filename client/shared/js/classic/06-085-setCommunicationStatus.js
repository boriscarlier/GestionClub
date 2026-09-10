function setCommunicationStatus(id,status){
 const p=(state.posts||[]).find(x=>x.id===id);if(!p)return;
 const next=normalizeCommunicationStatus(status);
 if(next==='Publié' && p.status!=='À valider' && p.status!=='Programmé'){
  toast('Communication','Une publication doit être validée ou programmée avant de passer à Publié.');
  return;
 }
 p.status=next;
 p.updatedAt=new Date().toISOString();
 localStorage.setItem(KEY,JSON.stringify(state));
 if(typeof logAdminAction==='function')logAdminAction('Communication','Statut',`${p.title||p.id} → ${next}`);
 renderCommunication();
 if(typeof renderCms==='function')renderCms();
}


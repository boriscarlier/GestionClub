function showAdminLogin(){
 hidePublicAndPortalLayersForAdministration();
 qaSetSpace('login');
 const login=document.getElementById('adminLoginScreen'),admin=document.getElementById('intranetApp'),pub=document.getElementById('publicApp');
 if(pub){pub.style.display='none';pub.classList.add('hidden')}
 if(admin){admin.classList.add('hidden');admin.style.display='none'}
 if(login){login.classList.remove('hidden');login.style.display='grid'}

 const sel=document.getElementById('adminPrototypeAccount');
 if(sel){
  const active=(state.accounts||[]).filter(a=>a.status!=='disabled');
  sel.innerHTML=active.length
   ? active.map(a=>`<option value="${a.id}">${escapeHtml(accountFullName(a))} — ${escapeHtml(a.email||'sans email')}</option>`).join('')
   : '<option value="">Aucun compte actif</option>';
 }
 const status=document.getElementById('adminLoginStatus');
 if(status)status.textContent=(state.accounts||[]).some(a=>a.status!=='disabled')
  ? 'Sélectionne le compte à utiliser pour tester ses droits et son périmètre.'
  : 'Aucun compte actif disponible.';
}

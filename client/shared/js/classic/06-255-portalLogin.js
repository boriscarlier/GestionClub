function portalLogin(){
 const lic=String(document.getElementById('portalLicenseInput')?.value||'').trim();
 const birth=String(document.getElementById('portalBirthInput')?.value||'').trim();
 const msg=document.getElementById('portalLoginMsg');
 if(!lic||!birth){if(msg)msg.textContent='Numéro de licence et date de naissance obligatoires en mode prototype.';return;}
 const m=(state.members||[]).find(x=>String(x.licenseNumber||'').trim()===lic && normalizeDateCell(x.birthDate)===birth);
 if(!m){if(msg)msg.textContent='Identifiants non reconnus.';return;}
 portalCurrentMemberId=m.id;
 localStorage.setItem('gestionclub_portal_member',m.id);
 if(msg)msg.textContent='';
 renderMemberPortal();
}

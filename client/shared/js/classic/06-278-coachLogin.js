function coachLogin(){
 const lic=String(document.getElementById('coachLicenseInput')?.value||'').trim();
 const birth=String(document.getElementById('coachBirthInput')?.value||'').trim();
 const msg=document.getElementById('coachLoginMsg');
 if(!lic||!birth){if(msg)msg.textContent='Numéro de licence et date de naissance obligatoires.';return;}
 const m=(state.members||[]).find(x=>String(x.licenseNumber||'').trim()===lic && normalizeDateCell(x.birthDate)===birth);
 if(!m){if(msg)msg.textContent='Identifiants non reconnus.';return;}
 if(!norm(m.type||m.licenseType).includes('educateur')&&!norm(m.type).includes('technique')){
  if(msg)msg.textContent='Cette licence ne dispose pas d’un accès éducateur.';return;
 }
 const teams=coachEligibleTeams(m);
 if(!teams.length){
  if(msg)msg.textContent='Aucune équipe autorisée n’est rattachée à cet éducateur.';return;
 }
 coachCurrentMemberId=m.id;
 coachCurrentTeamName=teams[0];
 coachCurrentPage='home';
 localStorage.setItem('gestionclub_coach_member',m.id);
 localStorage.setItem('gestionclub_coach_team',coachCurrentTeamName);
 if(msg)msg.textContent='';
 renderCoachPortal();
}

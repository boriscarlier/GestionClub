function emailCurrentMember(){
 if(!currentAdminCan('members','view'))return toast('Accès refusé','Accès licenciés non autorisé.');
 const account=typeof currentAdminAccount==='function'?currentAdminAccount():null;
 const unrestricted=!(state.accounts||[]).length;
 if(!unrestricted && !(typeof accountCanSeeSensitive==='function'&&accountCanSeeSensitive(account,'contact')))
  return toast('Accès refusé','Accès aux coordonnées non autorisé.');
 const m=(state.members||[]).find(x=>x.id===currentMemberId);
 if(!m||!m.email)return toast('Licencié','Aucune adresse email.');
 window.location.href='mailto:'+encodeURIComponent(m.email);
}

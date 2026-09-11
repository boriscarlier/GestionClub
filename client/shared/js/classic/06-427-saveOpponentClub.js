function saveOpponentClub(){
 const form=opponentFullFormValues();
 const name=form.name;
 if(!name)return toast('Club adverse','Nom du club obligatoire.');

 const matchNames=opponentNamesFromMatches();
 const canonical=matchNames.find(n=>opponentKey(n)===opponentKey(name));
 const exactName=canonical||name;

 let savedOpponent=currentOpponentEditId?opponentById(currentOpponentEditId):findOpponentClub(exactName);
 if(savedOpponent){
  savedOpponent.name=exactName;
  savedOpponent.city=form.city;
  savedOpponent.color=form.color;
  if(opponentLogoDraft)savedOpponent.logo=opponentLogoDraft;
 }else{
  savedOpponent={id:uid('opp'),name:exactName,city:form.city,color:form.color,logo:opponentLogoDraft||''};
  state.opponents.push(savedOpponent);
 }

 savedOpponent.fff={...(savedOpponent.fff||{}),...form.fff};
 if(window.__opponentFffPendingData)savedOpponent.fff={...savedOpponent.fff,...window.__opponentFffPendingData};

 opponentLogoDraft='';
 window.__opponentFffPendingData=null;
 opponentFffImportDraft=null;
 clearOpponentFullForm();
 const logoInput=document.getElementById('oppClubLogo');if(logoInput)logoInput.value='';
 const p=document.getElementById('oppLogoPreview');if(p)p.innerHTML='';
 const url=document.getElementById('oppClubLogoUrl');if(url)url.value='';
 const wp=document.getElementById('oppWebLogoPreview');if(wp)wp.innerHTML='';
 const ms=document.getElementById('oppMatchClubSelect');if(ms)ms.value='';
 save();
 renderOpponentClubs();
 closeOpponentEditor();
 if(typeof logAdminAction==='function')logAdminAction('Clubs adverses','Enregistrement fiche',exactName);
 toast('Club adverse','Fiche complète enregistrée.');
}

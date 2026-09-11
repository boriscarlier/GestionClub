function saveMember(){
 if(!currentAdminCan('members','create')){
  toast('Accès refusé','Ajout de licencié non autorisé.');
  return;
 }
 const first=document.getElementById('mFirst')?.value.trim()||'';
 const last=document.getElementById('mLast')?.value.trim()||'';
 const type=document.getElementById('mType')?.value||'Joueur';
 const category=document.getElementById('mCategory')?.value||'';
 const license=document.getElementById('mLicense')?.value||'En attente';
 const phone=document.getElementById('mPhone')?.value.trim()||'';

 if(!first||!last){
  toast('Licencié','Prénom et nom obligatoires.');
  return;
 }

 const duplicate=(state.members||[]).find(m=>
  norm(m.first)===norm(first) &&
  norm(m.last)===norm(last) &&
  norm(m.category||'')===norm(category||'')
 );
 if(duplicate){
  toast('Licencié','Un licencié avec le même nom et la même catégorie existe déjà.');
  return;
 }

 const member={
  id:uid('m'),first,last,type,category,license,phone,
  public:false,sourceFormat:'MANUAL'
 };
 state.members.push(member);
 save();
 closeModal('memberModal');

 ['mFirst','mLast','mPhone'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
 if(typeof renderMembers==='function')renderMembers();
 if(typeof renderAll==='function')renderAll();
 if(typeof logAdminAction==='function')logAdminAction('Licenciés','Création',`${first} ${last}`);
 toast('Licencié','Ajouté à la base.');
}


let matchStatusFilter='';
let selectedMatchIds=new Set();



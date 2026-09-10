function qaValidateMemberBlock(block){
 const roots={identity:'memberIdentityBlock',contact:'memberContactBlock',finance:'memberFinanceBlock',license:'memberLicensesBlock',guardian:'memberGuardianBlock',discipline:'memberDisciplineBlock'};
 const root=document.getElementById(roots[block]);
 if(!root?.querySelector('input,select,textarea')){toast('Non enregistré','Ouvrez ce bloc en modification avant de sauvegarder.');return false;}
 for(const input of root.querySelectorAll('input')){
  const value=input.value.trim();
  if(value&&input.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){toast('Non enregistré','Adresse email invalide.');input.focus();return false;}
  if(input.type==='number'&&value&&(Number(value)<0||!Number.isFinite(Number(value)))){toast('Non enregistré','Le montant doit être positif ou nul.');return false;}
  if(input.type==='date'&&value&&!parseDateSafe(value)){toast('Non enregistré','Date invalide.');return false;}
 }
 return true;
}


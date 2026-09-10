function accountCanSeeSensitive(account,group){
 if(!account)return false;
 const roles=account.roles||[];
 if(roles.includes('president')||roles.includes('admin'))return true;
 if(group==='contact'&&roles.some(r=>['secretary','sport','coach','manager'].includes(r)))return true;
 if(group==='guardians'&&roles.some(r=>['secretary','sport','coach'].includes(r)))return true;
 if(group==='discipline'&&roles.some(r=>['secretary','sport'].includes(r)))return true;
 if(group==='finance'&&roles.some(r=>['treasurer','president'].includes(r)))return true;
 return false;
}

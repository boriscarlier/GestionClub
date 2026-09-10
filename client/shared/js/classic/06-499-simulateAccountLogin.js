function simulateAccountLogin(id){
 const a=accountById(id);if(!a)return;
 if(a.status==='disabled'){toast('Comptes','Ce compte est désactivé.');return}
 a.lastLoginAt=new Date().toISOString();
 save();renderAccountDetail();renderAccounts();
 toast('Comptes','Dernière connexion simulée mise à jour.');
}


const PERMISSION_MODULES=['dashboard','members','teams','matches','discipline','communication','media','visual','documents','imports','statistics','accounts','settings','clubsettings'];
const PERMISSION_ACTIONS=['view','create','edit','delete'];

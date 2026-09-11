function accessAuditResults(){
 const accounts=state.accounts||[];
 return [
  {label:'Emails uniques',ok:countDuplicates(accounts,a=>a.email)===0,detail:'Chaque compte doit avoir une adresse email unique.'},
  {label:'Comptes actifs avec rôle',ok:accounts.filter(a=>a.status!=='disabled').every(a=>(a.roles||[]).length>0),detail:'Tout compte actif doit posséder au moins un rôle.'},
  {label:'Comptes actifs avec périmètre',ok:accounts.filter(a=>a.status!=='disabled').every(a=>!!a.scope?.type),detail:'Un périmètre doit être explicite.'},
  {label:'Matrice de permissions disponible',ok:!!state.permissionMatrix&&Object.keys(state.permissionMatrix).length>0,detail:'Les permissions par rôle doivent être définies.'},
  {label:'Journal des actions disponible',ok:Array.isArray(state.auditLog),detail:'Le journal local doit être initialisé.'},
  {label:'Aucun mot de passe persistant dans les comptes',ok:accounts.every(a=>!('password' in a)&&!('passwordHash' in a)),detail:'Le prototype ne doit pas stocker de mot de passe exploitable.'},
  {label:'Routes Administration protégées côté interface',ok:typeof enforcePagePermission==='function',detail:'Le prototype bloque les pages selon les droits.'},
  {label:'Actions cohérentes avec le droit Voir',ok:(state.roles||[]).every(r=>state.permissionMatrix?.[r.id]==='*'||PERMISSION_MODULES.every(m=>{const a=state.permissionMatrix?.[r.id]?.[m]||[];return !a.some(x=>x!=='view')||a.includes('view')})),detail:'Créer, modifier ou supprimer implique automatiquement le droit Voir.'}
 ];
}

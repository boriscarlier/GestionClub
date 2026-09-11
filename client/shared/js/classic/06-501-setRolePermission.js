function setRolePermission(roleId,module,action,enabled){
 if(!currentAdminCan('accounts','edit')||!PERMISSION_MODULES.includes(module)||!PERMISSION_ACTIONS.includes(action)||!(state.roles||[]).some(r=>r.id===roleId))return;
 if(state.permissionMatrix?.[roleId]==='*')return;
 if(!state.permissionMatrix)state.permissionMatrix={};
 if(!state.permissionMatrix[roleId])state.permissionMatrix[roleId]={};
 if(!Array.isArray(state.permissionMatrix[roleId][module]))state.permissionMatrix[roleId][module]=[];
 let arr=state.permissionMatrix[roleId][module];

 if(enabled&&!arr.includes(action))arr.push(action);
 if(enabled&&action!=='view'&&!arr.includes('view'))arr.push('view');

 if(!enabled){
  arr=arr.filter(x=>x!==action);
  // Removing "view" removes all operational actions for coherence.
  if(action==='view')arr=[];
 }
 state.permissionMatrix[roleId][module]=arr;
 localStorage.setItem(KEY,JSON.stringify(state));
 if(typeof logAdminAction==='function')logAdminAction('Permissions','Modification',`${roleId} • ${module} • ${action}=${enabled?'oui':'non'}`);
 renderPermissions();
 if(typeof applyAdminPermissions==='function')applyAdminPermissions();
}

const PERMISSION_MODULE_LABELS={
 dashboard:'Tableau de bord',
 members:'Licenciés',
 teams:'Équipes',
 matches:'Matchs / planning / adversaires',
 discipline:'Discipline',
 communication:'Communication',
 media:'Médiathèque',
 visual:'Générateur visuel',
 documents:'Documents & contrôles',
 imports:'Importations',
 statistics:'Statistiques',
 accounts:'Comptes utilisateurs',
 settings:'Paramètres système',
 clubsettings:'Paramétrage du club'
};
const PERMISSION_ACTION_LABELS={view:'Voir',create:'Créer',edit:'Modifier',delete:'Supprimer'};



(function(root){
'use strict';
const E=id=>document.getElementById(id);
function allowed(){const a=currentAdminAccount();return qaSpace==='admin'&&a&&a.status!=='disabled'&&a.scope?.type==='club'&&currentAdminCan('settings','view');}
function inspect(db){
 const collections={};let anomalies=0;
 for(const key of ['members','matches','teams','accounts']){
  const rows=db?.[key],seen=new Set();let missing=0,duplicates=0;
  if(!Array.isArray(rows)){collections[key]={count:0,invalidCollection:true,missing:0,duplicates:0};anomalies++;continue;}
  for(const row of rows){if(!row||typeof row.id!=='string'||!row.id.trim()){missing++;continue;}if(seen.has(row.id))duplicates++;seen.add(row.id);}
  collections[key]={count:rows.length,invalidCollection:false,missing,duplicates};anomalies+=missing+duplicates;
 }
 return {collections,anomalies};
}
function report(){
 if(!allowed())throw Error('Accès réservé à l’administration du club.');
 const result=inspect(state);let storage='unavailable',baseBytes=null;
 try{const raw=localStorage.getItem(KEY);baseBytes=raw===null?0:new TextEncoder().encode(raw).length;storage=raw===null?'absent':root.FCUContactsCore.stable(JSON.parse(raw))===root.FCUContactsCore.stable(state)?'same':'different';}catch(e){storage='unreadable';}
 return {format:'FC_LA_COUR_READINESS_DIAGNOSTIC',schemaVersion:1,build:QA_BUILD,generatedAt:new Date().toISOString(),...result,storage,baseBytes,mode:location.protocol==='file:'?'local-file':'web-page',sharedDatabase:'not-integrated',serverAuthentication:'not-integrated',note:'Contrôle local limité aux collections et identifiants. Aucun nom, identifiant individuel, contact, chemin local ou contenu de sauvegarde exporté. Taille de la base JSON uniquement ; ne mesure pas le quota disponible.'};
}
function render(){
 const box=E('readinessResult');if(!allowed()){box.replaceChildren();return;}
 const r=report();box.replaceChildren();
 const p=document.createElement('p');p.textContent=r.anomalies?'À examiner : '+r.anomalies+' anomalie(s) d’identifiants ou de collections. Conservez une sauvegarde pour diagnostic.':'Les identifiants des quatre collections contrôlées sont présents et uniques.';box.append(p);
 const table=document.createElement('table');table.className='table';const head=document.createElement('thead'),line=document.createElement('tr');for(const label of ['Collection','Fiches','Identifiants invalides','Doublons supplémentaires']){const th=document.createElement('th');th.scope='col';th.textContent=label;line.append(th);}head.append(line);table.append(head);
 const body=document.createElement('tbody');for(const [key,label] of [['members','Licenciés'],['matches','Matchs'],['teams','Équipes'],['accounts','Comptes']]){const x=r.collections[key],tr=document.createElement('tr');for(const value of [label,x.invalidCollection?'Collection absente ou invalide':x.count,x.missing,x.duplicates]){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}body.append(tr);}table.append(body);box.append(table);
 const storage=document.createElement('p');storage.textContent=({same:'La base affichée correspond à la base enregistrée.',different:'La base affichée diffère de la base enregistrée. N’écrasez pas les données : conservez les fenêtres ouvertes pour examiner la situation.',absent:'Aucune base enregistrée à cet emplacement.',unreadable:'La base enregistrée est illisible ou inaccessible.',unavailable:'Stockage non accessible.'})[r.storage]+(r.baseBytes!==null?' Taille du JSON enregistré : '+(r.baseBytes/1024/1024).toLocaleString('fr-FR',{maximumFractionDigits:2})+' Mo.':'');box.append(storage);
 const stamp=document.createElement('p');stamp.textContent='Contrôle effectué à '+new Date(r.generatedAt).toLocaleTimeString('fr-FR')+'. Ce bilan ne valide pas encore un usage partagé.';box.append(stamp);
}
function download(){try{const r=report();prototypeDownloadText('FC_LA_COUR_diagnostic_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json',JSON.stringify(r,null,2),'application/json');}catch(e){toast('Diagnostic',e.message);}}
const prevGo=goTo;goTo=function(target){const result=prevGo.apply(this,arguments);if(target==='readiness')render();else E('readinessResult').replaceChildren();return result;};
const prevSpace=qaSetSpace;qaSetSpace=function(){const result=prevSpace.apply(this,arguments);if(!allowed())E('readinessResult').replaceChildren();return result;};
const prevRender=renderAll;renderAll=function(){const result=prevRender.apply(this,arguments);if(E('readiness').classList.contains('active'))render();return result;};
window.addEventListener('storage',e=>{if((e.key===KEY||e.key===null)&&E('readiness').classList.contains('active'))render();});
PAGE_PERMISSION_MODULE.readiness='settings';ADMIN_PAGE_TITLES.readiness='Diagnostic & partage';
root.FCLCReadiness=Object.freeze({inspect,report,render,download});
})(globalThis);


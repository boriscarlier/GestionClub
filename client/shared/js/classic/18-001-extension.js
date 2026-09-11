
(function(root){
 'use strict';
 const E=id=>document.getElementById(id),C=root.FCUContactsCore;
 let draft=null,ticket=0,busy=false,reviewDisk=null,reviewMemory='',reviewAux='',owner='',lastDownload='';
 const copy=x=>JSON.parse(JSON.stringify(x));
 const auxiliary=()=>JSON.stringify([localStorage.getItem('gestionclub_coach_lineups'),localStorage.getItem(PROTOTYPE_FEEDBACK_KEY),localStorage.getItem(PROTOTYPE_SCENARIO_KEY),coachLineups]);
 function allowed(edit=false){const a=currentAdminAccount();return qaSpace==='admin'&&a&&a.status!=='disabled'&&a.scope?.type==='club'&&currentAdminCan('settings',edit?'edit':'view');}
 function requireAccess(edit=false){if(!allowed(edit))throw Error('Un compte autorisé sur l’ensemble du club est requis pour les sauvegardes'+(edit?' et la restauration.':'.'));}
 function summary(db,lineups={}){
  const members=Array.isArray(db.members)?db.members:[],demo=members.filter(m=>['DEMO','REALISTIC_2026'].includes(m.sourceFormat)||/^(?:DEMO|TEST)-/.test(String(m.licenseNumber||''))),imported=members.filter(m=>m.sourceFormat==='LICENCES_REFERENCE_V2');
  return {licences:members.length,imported:imported.length,persons:new Set(imported.map(m=>String(m.personNumber||'').trim()).filter(Boolean)).size,demo:demo.length,matches:(db.matches||[]).length,teams:(db.teams||[]).length,lineups:Object.keys(lineups||{}).length};
 }
 function validate(p){
  if(!p||!/^(?:[A-Z][A-Z0-9]*_)+FULL_BACKUP$/.test(p?.format||'')||p.schemaVersion!==1||!p.state||!p.lineups||typeof p.lineups!=='object'||Array.isArray(p.lineups))throw Error('Choisir une sauvegarde complète Gestion Club. Un export CSV ou une capture Footclubs ne restaure pas la base.');
  for(const key of ['members','matches','teams','accounts']){
   if(!Array.isArray(p.state[key]))throw Error('Sauvegarde invalide : liste '+key+' absente.');
   const ids=new Set();for(const row of p.state[key]){if(!row||typeof row!=='object'||Array.isArray(row)||typeof row.id!=='string'||!row.id||ids.has(row.id))throw Error('Sauvegarde invalide : identifiant absent, invalide ou dupliqué dans '+key+'. Aucune donnée remplacée. Conservez ce JSON pour diagnostic.');ids.add(row.id);}
  }
  if(p.feedback!==undefined&&!Array.isArray(p.feedback))throw Error('Retours de test invalides.');
  if(p.scenarios!==undefined&&(!p.scenarios||typeof p.scenarios!=='object'||Array.isArray(p.scenarios)))throw Error('Scénarios invalides.');
  return p;
 }
 function status(t){E('continuityStatus').textContent=t;}
 function clear(){ticket++;draft=null;E('continuityPreview').replaceChildren();E('continuityConfirm').checked=false;E('continuityConfirm').disabled=true;E('continuityRestore').disabled=true;E('continuityFile').value='';}
 function render(){
  const visible=allowed();E('continuityBar').hidden=!visible;
  if(!visible){clear();E('continuityCurrent').textContent='';status('');return;}
  const x=summary(state,coachLineups),label=x.imported?x.imported+' licences importées · '+x.persons+' personnes':x.demo===x.licences&&x.demo?'Base de démonstration uniquement':x.licences?'Fiches locales présentes · provenance à vérifier':'Aucun licencié chargé';
  E('continuityBarText').textContent='V1.25.12.3 · '+label;
  E('continuityCurrent').textContent=label+' · '+x.demo+' fiches de démonstration · '+x.matches+' matchs · '+x.lineups+' compositions.';
  let filename='';try{filename=decodeURIComponent(location.pathname.split('/').pop()||'');}catch(e){}
  E('continuityLocation').textContent=location.protocol==='file:'?(filename==='GESTION_CLUB_Manager.html'?'Nom stable utilisé. Gardez ce fichier dans ce dossier avec le même profil Brave.':'Fichier ouvert : '+filename+'. Pour les prochaines mises à jour, utilisez GESTION_CLUB_Manager.html dans un dossier fixe. Une restauration peut être nécessaire pour ce premier changement de nom.'):'Application ouverte depuis une adresse web. Conservez la même adresse et le même profil de navigateur.';
  E('continuityDownloadState').textContent=lastDownload||'La présence d’un fichier de sauvegarde sur votre ordinateur ne peut pas être vérifiée par cette page.';
  E('continuityFile').disabled=!allowed(true)||busy;
 }
 function open(){requireAccess();goTo('continuity');render();}
 function exportBackup(){try{requireAccess();const p=qaBackupPayload();validate(p);prototypeDownloadText('GESTION_CLUB_sauvegarde_complete_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json',JSON.stringify(p,null,2),'application/json');lastDownload='Téléchargement demandé à '+new Date().toLocaleTimeString('fr-FR')+'. Vérifiez le fichier dans Téléchargements.';render();status(lastDownload);}catch(e){toast('Sauvegarde',e.message);}}
 async function load(event){
  const file=event.target.files?.[0];if(!file)return;
  clear();const token=ticket;status('Contrôle de la sauvegarde…');
  try{
   requireAccess(true);const account=currentAdminAccount().id;
   if(file.size>30*1024*1024)throw Error('Sauvegarde trop volumineuse pour cette restauration (maximum 30 Mo).');
   const p=validate(JSON.parse(await file.text()));
   if(token!==ticket||!allowed(true)||currentAdminAccount().id!==account||!E('continuity').classList.contains('active'))return;
   draft=copy(p);owner=account;reviewMemory=C.stable(state);reviewDisk=localStorage.getItem(KEY);reviewAux=auxiliary();
   const a=summary(state,coachLineups),b=summary(p.state,p.lineups),box=E('continuityPreview');
   const meta=document.createElement('p');meta.textContent='Sauvegarde : '+file.name+' · version '+String(p.build||'non indiquée')+' · date '+(Number.isFinite(Date.parse(p.exportedAt))?new Date(p.exportedAt).toLocaleString('fr-FR'):'non indiquée');box.append(meta);
   const table=document.createElement('table');table.className='table';
   for(const [label,key] of [['Licences totales','licences'],['Licences importées de référence','imported'],['Personnes importées','persons'],['Fiches de démonstration','demo'],['Matchs','matches'],['Équipes','teams'],['Compositions','lineups']]){const tr=document.createElement('tr');for(const text of [label,String(a[key]),String(b[key])]){const cell=document.createElement('td');cell.textContent=text;tr.append(cell);}table.append(tr);}
   const head=document.createElement('thead'),tr=document.createElement('tr');for(const text of ['Contenu','Base actuelle','Sauvegarde choisie']){const th=document.createElement('th');th.textContent=text;th.scope='col';tr.append(th);}head.append(tr);table.prepend(head);box.append(table);
   E('continuityConfirm').disabled=false;status('Sauvegarde reconnue. La restauration remplacera les données locales, les compositions et les retours de test. Vérifiez les deux colonnes avant de confirmer.');
  }catch(e){if(token!==ticket)return;clear();status('Restauration non préparée : '+e.message);}
 }
 async function restore(){
  if(busy)return;
  const token=ticket;
  try{
   requireAccess(true);if(!draft||!E('continuityConfirm').checked)throw Error('Choisir une sauvegarde et confirmer son aperçu.');
   const fresh=()=>{requireAccess(true);if(token!==ticket||currentAdminAccount().id!==owner||C.stable(state)!==reviewMemory||localStorage.getItem(KEY)!==reviewDisk||auxiliary()!==reviewAux||!E('continuityConfirm').checked||!E('continuity').classList.contains('active'))throw Error('Les données ou le contexte ont changé. Recharger la sauvegarde pour refaire son contrôle.');};
   fresh();if(reviewDisk!==null&&C.stable(JSON.parse(reviewDisk))!==reviewMemory)throw Error('La base enregistrée et la base affichée diffèrent. Rechargez l’application avant restauration.');
   const payload=copy(validate(draft));busy=true;E('continuityRestore').disabled=true;E('continuityFile').disabled=true;
   status('Sauvegarde de récupération de la base actuelle…');
   await root.FCUBackupStore.save(JSON.stringify(qaBackupPayload()),'before-restore');fresh();
   qaRestoreBackup(payload);clear();
   portalLogout();coachLogout();sessionStorage.removeItem('gestionclub_admin_account');qaDraftOwner=null;memberBlockEditState.clear();
   renderAll();showPublicPage('public-home');toast('Restauration terminée','Reconnectez-vous puis vérifiez les effectifs dans Données & sauvegarde.');
  }catch(e){status('Restauration arrêtée : '+e.message);E('continuityRestore').disabled=true;}
  finally{busy=false;render();}
 }
 async function recovery(){try{requireAccess();const account=currentAdminAccount().id,token=ticket,raw=await root.FCUBackupStore.read('before-restore');requireAccess();if(account!==currentAdminAccount().id||token!==ticket)return;if(!raw)throw Error('Aucune sauvegarde avant restauration disponible dans cet emplacement.');validate(JSON.parse(raw));prototypeDownloadText('GESTION_CLUB_avant_restauration.json',raw,'application/json');status('Copie de récupération téléchargée. Choisissez ce JSON ci-dessus pour examiner son contenu avant restauration.');}catch(e){status(e.message);}}
 E('continuityFile').addEventListener('change',load);
 E('continuityConfirm').addEventListener('change',()=>{ticket++;E('continuityRestore').disabled=busy||!draft||!E('continuityConfirm').checked||!allowed(true);});
 const previousGo=goTo;goTo=function(target){if(target!=='continuity')clear();const result=previousGo.apply(this,arguments);render();return result;};
 const previousSpace=qaSetSpace;qaSetSpace=function(){const result=previousSpace.apply(this,arguments);render();return result;};
 const previousRender=renderAll;renderAll=function(){const result=previousRender.apply(this,arguments);render();return result;};
 const previousClose=closeAdministrationTransientUI;closeAdministrationTransientUI=function(target){if(target!=='continuity')clear();return previousClose.apply(this,arguments);};
 qaImportBackupFile=function(event){try{open();return load(event);}catch(e){toast('Restauration',e.message);}};
 qaExportBackup=exportBackup;
 window.addEventListener('storage',e=>{if([KEY,'gestionclub_coach_lineups',PROTOTYPE_FEEDBACK_KEY,PROTOTYPE_SCENARIO_KEY,null].includes(e.key)){clear();status('Une autre fenêtre a modifié les données. Rechargez cette page avant de restaurer.');}});
 PAGE_PERMISSION_MODULE.continuity='settings';ADMIN_PAGE_TITLES.continuity='Données & sauvegarde';
 root.GestionClubContinuity=Object.freeze({summary,validate,open,exportBackup,load,restore,recovery,render});render();
})(globalThis);



/* Full recovery copies are kept outside localStorage's small synchronous quota. */
(function(root){
 'use strict';
 function operation(mode,raw,key='contacts'){
  return new Promise((resolve,reject)=>{
   let db=null,tx=null,done=false,result=null;
   const finish=(error)=>{if(done)return;done=true;clearTimeout(timer);if(db)db.close();error?reject(error):resolve(result);};
   const problem=()=>{const e=new Error('Sauvegarde interne indisponible. Aucune modification appliquée. Conservez la sauvegarde téléchargée et vérifiez l’espace disponible ou les autorisations de stockage du navigateur.');e.code='FCU_SAUVEGARDE_INDISPONIBLE';return e;};
   const timer=setTimeout(()=>{if(tx)try{tx.abort();}catch(e){}finish(problem());},20000);
   try{
    if(!root.indexedDB)throw problem();
    const request=root.indexedDB.open('GESTION_CLUB_RECOVERY',1);
    request.onupgradeneeded=()=>{if(done){request.transaction.abort();return;}const opened=request.result;if(!opened.objectStoreNames.contains('backups'))opened.createObjectStore('backups');};
    request.onerror=()=>finish(problem());request.onblocked=()=>finish(problem());
    request.onsuccess=()=>{
     db=request.result;if(done){db.close();return;}
     db.onversionchange=()=>{if(tx)try{tx.abort();}catch(e){}finish(problem());};
     try{
      tx=db.transaction('backups',mode);const store=tx.objectStore('backups');
      const task=mode==='readwrite'?store.put(raw,key):store.get(key);
      task.onsuccess=()=>{result=mode==='readwrite'?true:(task.result??null);};
      task.onerror=()=>{try{tx.abort();}catch(e){}finish(problem());};
      tx.oncomplete=()=>finish();tx.onabort=()=>finish(problem());tx.onerror=()=>finish(problem());
     }catch(e){finish(problem());}
    };
   }catch(e){finish(problem());}
  });
 }
 root.FCUBackupStore=Object.freeze({save:(raw,key='contacts')=>operation('readwrite',raw,key),read:(key='contacts')=>operation('readonly',undefined,key)});
})(globalThis);

(function(root){
 'use strict';
 const C=root.FCUContactsCore,E=id=>document.getElementById(id),clone=C.clone;
 const BACKUP='gestionclub_footclubs_contacts_before_change_v1';
 let snapshot=null,review=null,disk=null,backupProof=null,diagnostics=[];
 let storageChanged=false,saving=false,epoch=0;
 const active=()=>E('footclubsui').classList.contains('active')&&!E('intranetApp').classList.contains('hidden');
 function readable(){const a=currentAdminAccount();return active()&&qaSpace==='admin'&&a&&a.status!=='disabled'&&a.scope?.type==='club'&&currentAdminCan('imports','view')&&currentAdminCan('members','view')&&['contact','guardians','finance','discipline'].every(g=>accountCanSeeSensitive(a,g));}
 function writable(){return readable()&&currentAdminCan('members','edit')&&(currentAdminCan('imports','edit')||currentAdminCan('imports','create'))&&currentAdminCan('settings','view');}
 function requireRead(){if(!readable())throw Error('Comparaison réservée aux comptes autorisés sur l’ensemble du club.');}
 function requireWrite(){if(!writable())throw Error('Droits de modification des licenciés, d’import et de sauvegarde complète requis.');}
 const actor=()=>String(currentAdminAccount()?.id||'');
 function el(tag,value){const n=document.createElement(tag);if(value!==undefined)n.textContent=String(value);return n;}
 function message(value){E('fcuCompareStatus').textContent=value;}
 function catchError(error){message(error.message||String(error));diagnostics.push({code:error.code||'REFUS',message:error.message||String(error)});diagnostics=diagnostics.slice(-20);E('fcuApplyContacts').disabled=true;}
 function invalidate(){epoch++;review=null;backupProof=null;E('fcuDiff').replaceChildren();E('fcuApplyConfirm').checked=false;E('fcuApplyConfirm').disabled=true;E('fcuApplyContacts').disabled=true;E('fcuBackupContacts').disabled=true;}
 function reset(){snapshot=null;invalidate();disk=null;diagnostics=[];E('fcuReconcile').hidden=true;E('fcuContactHistory').replaceChildren();message('');E('fcuWorkingSeason').value='';}
 function render(){
  E('fcuReconcile').hidden=!active();
  E('fcuCompareContacts').disabled=!readable()||!snapshot;
  E('fcuWorkingSeason').disabled=!readable();
  if(!readable()){E('fcuContactHistory').replaceChildren();message('Le rapprochement des contacts nécessite un compte autorisé sur l’ensemble du club.');return;}
  if(!snapshot)message('Ouvrez une fiche personne avec Identité, Contacts et Licences pour comparer ses contacts.');
  renderHistory();
 }
 function setup(s,demo){
  reset();E('fcuReconcile').hidden=false;
  if(!demo&&s.schema===root.NeoFootclubsSourceContract.schema&&s.source.kind==='person')snapshot=clone(s);
  E('fcuWorkingSeason').value=String(state.clubProfile?.source?.season||'');
  message(snapshot?'Capture disponible. Vérifiez la saison de travail, puis lancez la comparaison.':'Ouvrez une fiche personne avec Identité, Contacts et Licences pour comparer ses contacts.');render();
 }
 function changed(){epoch++;E('fcuApplyConfirm').checked=false;refreshApply();}
 function chosen(){return Array.from(E('fcuDiff').querySelectorAll('input:checked')).map(x=>x.value);}
 function refreshApply(){E('fcuApplyContacts').disabled=!(!saving&&writable()&&review?.canApply&&backupProof&&backupProof.actor===actor()&&E('fcuApplyConfirm').checked&&chosen().length);}
 function compare(){
  invalidate();diagnostics=[];
  try{
   requireRead();checkDisk();if(!snapshot)throw Error('Charger une fiche personne pour comparer.');
   review=C.plan(state,snapshot,E('fcuWorkingSeason').value);disk=localStorage.getItem(KEY);
   const box=E('fcuDiff');
   box.append(el('p','Contrôle de la personne uniquement. Aucun numéro de licence n’est déduit de son numéro personne.'));
   if(review.issues.length){const list=el('ul');review.issues.forEach(i=>list.append(el('li',i.message)));box.append(list);diagnostics=clone(review.issues);}
   else box.append(el('p','Une fiche locale correspond au numéro personne ; nom, naissance, club et saison concordent.'));
   const scroll=el('div');scroll.className='fcu-diff-scroll';scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label','Comparaison des contacts — tableau défilant');
   const table=el('table'),head=el('thead'),tr=el('tr');['Choix','Champ','Valeur locale','Valeur capturée','Valeur proposée'].forEach(t=>{const th=el('th',t);th.scope='col';tr.append(th)});head.append(tr);table.append(head);const body=el('tbody');
   review.changes.forEach(c=>{const row=el('tr'),choose=el('td'),label=el('label'),input=el('input');input.type='checkbox';input.value=c.key;input.disabled=!review.canApply||!writable();input.setAttribute('aria-label','Appliquer '+c.label);input.addEventListener('change',changed);label.append(input);choose.append(label);row.append(choose,el('td',c.label),el('td',Object.entries(c.before).map(([k,v])=>({mobile:'Mobile',phone:'Téléphone affiché',email:'Email',homePhone:'Domicile',workPhone:'Travail'}[k]||k)+' : '+(v||'Non renseigné')).join('\n')),el('td',c.raw),el('td',c.value));body.append(row);});table.append(body);scroll.append(table);if(review.changes.length)box.append(scroll);
   message(review.issues.length?'Application bloquée : résoudre les points signalés, puis refaire la comparaison.':review.changes.length?'Choisissez les champs, téléchargez la sauvegarde puis confirmez. Les valeurs absentes ne sont jamais effacées.':'Aucun écart de contact reconnu. Aucune écriture nécessaire.');
   E('fcuBackupContacts').disabled=!review.canApply||!writable();
   E('fcuDiff').tabIndex=-1;E('fcuDiff').focus();
  }catch(e){invalidate();catchError(e);}
 }
 function checkDisk(){const raw=localStorage.getItem(KEY);if(storageChanged||(raw!==null&&C.stable(JSON.parse(raw))!==C.stable(state)))throw Error('La base locale et celle enregistrée diffèrent. Rechargez la page avant de modifier des contacts.');}
 function ensureCurrent(){checkDisk();if(!review||C.stable(state)!==review.baseline||localStorage.getItem(KEY)!==disk)throw Error('La base a changé depuis la comparaison, ici ou dans un autre onglet. Refaire le contrôle.');}
 function backup(){try{requireWrite();ensureCurrent();const data=qaBackupPayload();prototypeDownloadText('GESTION_CLUB_avant_contacts_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json',JSON.stringify(data,null,2),'application/json');backupProof={baseline:review.baseline,actor:actor()};E('fcuApplyConfirm').disabled=false;message('Téléchargement demandé. Vérifiez la sauvegarde dans vos téléchargements avant de confirmer.');}catch(e){catchError(e);}}
 async function commit(next){
  checkDisk();
  const expectedDisk=disk,baseline=C.stable(state),expectedActor=actor(),ticket=epoch;
  if(localStorage.getItem(KEY)!==expectedDisk)throw Error('Une autre fenêtre a modifié la base. Refaire la comparaison.');
  message('Sauvegarde interne en cours…');
  await root.FCUBackupStore.save(JSON.stringify(qaBackupPayload()));
  requireWrite();
  if(ticket!==epoch||actor()!==expectedActor||C.stable(state)!==baseline||localStorage.getItem(KEY)!==expectedDisk)throw Error('Le contexte ou les données ont changé pendant la sauvegarde. Aucune modification appliquée ; refaire la comparaison.');
  try{localStorage.setItem(KEY,JSON.stringify(next));}catch(cause){const error=new Error('La base ne peut pas être enregistrée : espace de stockage insuffisant ou accès refusé. Aucune modification appliquée ; la sauvegarde de récupération est disponible.');error.code='FCU_BASE_NON_ENREGISTREE';throw error;}
  state=next;
  try{if(typeof renderMembers==='function')renderMembers();}catch(e){/* Commit succeeded; reload can refresh presentation. */}
 }
 function beginSave(){if(saving)return false;saving=true;E('fcuApplyContacts').disabled=true;E('fcuApplyContacts').textContent='Enregistrement…';return true;}
 function endSave(){saving=false;E('fcuApplyContacts').textContent='Appliquer les contacts choisis';}
 async function apply(){
  if(!beginSave())return;
  try{
   requireWrite();ensureCurrent();
   if(!backupProof||backupProof.actor!==actor()||backupProof.baseline!==review.baseline||!E('fcuApplyConfirm').checked)throw Error('Télécharger la sauvegarde et confirmer les valeurs avant application.');
   const result=C.apply(state,snapshot,review,chosen(),actor(),new Date().toISOString(),crypto.randomUUID());
   await commit(result.state);invalidate();renderHistory();message('Contacts enregistrés et opération journalisée. Vous pouvez comparer à nouveau ou annuler ci-dessous.');
   E('fcuApplyConfirm').checked=false;
  }catch(e){catchError(e);}finally{endSave();}
 }
 function renderHistory(){
  const box=E('fcuContactHistory');box.replaceChildren();if(!readable())return;
  const rows=state.footclubsContacts?.history||[];
  if(!rows.length){box.append(el('p','Aucune application de contacts enregistrée.'));return;}
  for(const row of rows){
   const detail=el('details');detail.append(el('summary',new Date(row.at).toLocaleString('fr-FR')+' · '+row.fields.map(k=>C.fields[k]?.label||k).join(', ')+(row.undone?' · Annulée':'')));
   detail.append(el('p','Fiche locale '+row.memberId+' · capture du '+new Date(row.capturedAt).toLocaleString('fr-FR')));
   for(const key of row.fields)for(const k of C.fields[key]?.keys||[])detail.append(el('p',({mobile:'Mobile',phone:'Téléphone affiché',email:'Email',homePhone:'Domicile',workPhone:'Travail'}[k]||k)+' : '+(row.before[k]||'Non renseigné')+' → '+(row.after[k]||'Non renseigné')));
   if(!row.undone){const label=el('label'),check=el('input'),button=el('button','Annuler cette opération');check.type='checkbox';check.disabled=!writable();label.append(check,el('span',' Je confirme le retour aux valeurs précédentes affichées.'));button.type='button';button.className='ghost';button.disabled=true;check.addEventListener('change',()=>button.disabled=!check.checked||!writable());button.addEventListener('click',()=>{if(!check.checked)return;return undo(row.id);});detail.append(label,button);}
   box.append(detail);
  }
 }
 async function undo(id){if(!beginSave())return;try{requireWrite();checkDisk();const baseline=C.stable(state);disk=localStorage.getItem(KEY);const next=C.undo(state,id,actor());if(C.stable(state)!==baseline)throw Error('La base a changé.');await commit(next);invalidate();renderHistory();message('Opération annulée. Les autres fiches, compositions et présences sont conservées.');}catch(e){catchError(e);}finally{endSave();}}
 async function recoveryBackup(){try{
  requireWrite();const account=actor(),ticket=epoch;
  const raw=(await root.FCUBackupStore.read())||localStorage.getItem(BACKUP);
  requireWrite();if(account!==actor()||ticket!==epoch)throw Error('Le contexte a changé : relancer le téléchargement depuis ce module.');
  if(!raw)throw Error('Aucune sauvegarde de récupération disponible pour les contacts.');
  const payload=JSON.parse(raw);if(payload.format!=='GESTION_CLUB_FULL_BACKUP'||payload.schemaVersion!==1)throw Error('Sauvegarde de récupération non reconnue.');
  prototypeDownloadText('GESTION_CLUB_recuperation_contacts.json',raw,'application/json');message('Sauvegarde de récupération téléchargée. Sa restauration complète reste disponible dans les outils de sauvegarde du club.');
 }catch(e){catchError(e);}}
 function report(){try{requireRead();const payload={schema:'la-cour-manager/contacts-diagnostic/1',build:'1.22.13',generatedAt:new Date().toISOString(),captureLoaded:!!snapshot,candidateCount:review?.candidateCount??null,changeCount:review?.changes.length??null,codes:diagnostics.map(x=>x.code),canApply:!!review?.canApply};prototypeDownloadText('GESTION_CLUB_diagnostic_contacts.json',JSON.stringify(payload,null,2),'application/json');message('Diagnostic téléchargé : codes de contrôle et compteurs, sans coordonnées ni identité.');}catch(e){catchError(e);}}
 E('fcuWorkingSeason').addEventListener('input',()=>{invalidate();message('Saison modifiée : refaire la comparaison.');});
 E('fcuApplyConfirm').addEventListener('change',()=>{epoch++;refreshApply();});
 window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){storageChanged=true;invalidate();message('La base a changé dans un autre onglet. Rechargez la page avant une application.');}});
 root.FCUReconcile=Object.freeze({setup,reset,render,compare,backup,apply,report,recoveryBackup});
})(globalThis);


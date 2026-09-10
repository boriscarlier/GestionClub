
(function(root){
'use strict';
const E=id=>document.getElementById(id),stable=x=>root.FCUContactsCore.stable(x);
let epoch=0,review=null,reference=null,referenceOwner=null;
function allowed(){const a=currentAdminAccount();return qaSpace==='admin'&&a&&a.status!=='disabled'&&a.scope?.type==='club'&&currentAdminCan('settings','view');}
function access(){if(!allowed())throw Error('Accès réservé à l’administration du club.');}
function contents(p){return {state:p.state,lineups:p.lineups,feedback:p.feedback||[],scenarios:p.scenarios||{}};}
const ACCOUNT_FIELDS={first:'Prénom',last:'Nom',email:'Adresse courriel',function:'Fonction',status:'État du compte',roles:'Rôles',scope:'Périmètre des droits',memberId:'Rattachement à une fiche',note:'Note',createdAt:'Date de création',updatedAt:'Date de modification',lastLoginAt:'Date de dernière connexion'};
const STATE_FIELDS={planning:'Planning',posts:'Publications',media:'Médiathèque',rankings:'Classements',importHistory:'Historique des imports',discipline:'Discipline',automationRules:'Règles automatiques',automationProposals:'Propositions automatiques',automationLog:'Journal des automatismes',documentCenter:'Documents',opponents:'Clubs adverses',importRegistry:'Registre des imports',importFreshness:'Fraîcheur des imports',auditLog:'Journal des actions',clubProfile:'Paramétrage du club',regulatoryReviewState:'Suivi réglementaire',permissionMatrix:'Matrice des permissions',roles:'Définition des rôles',coachTrainingSessions:'Séances d’entraînement',prototypeRealisticNotes:'Notes de démonstration',coachFmiPreparation:'Préparation FMI',coachCallups:'Convocations',prototypeSeedVersions:'Versions des exemples',importedDataNeedsRelinking:'Suivi des rattachements',footclubsContacts:'Historique des contacts Footclubs'};
function differentField(a,b,key){return Object.hasOwn(a,key)!==Object.hasOwn(b,key)||stable(a[key])!==stable(b[key]);}
function details(local,incoming){
 const incomingAccounts=new Map(incoming.state.accounts.map(a=>[a.id,a])),counts={},known=new Set(Object.keys(ACCOUNT_FIELDS));let unknownAccountFields=0;
 for(const a of local.state.accounts){const b=incomingAccounts.get(a.id);if(!b)continue;for(const key of Object.keys(ACCOUNT_FIELDS))if(differentField(a,b,key))counts[key]=(counts[key]||0)+1;for(const key of new Set([...Object.keys(a),...Object.keys(b)]))if(key!=='id'&&!known.has(key)&&differentField(a,b,key))unknownAccountFields++;}
 const accountFields=Object.entries(ACCOUNT_FIELDS).filter(([key])=>counts[key]).map(([key,label])=>({field:key,label,count:counts[key]}));
 const stateSections=Object.entries(STATE_FIELDS).filter(([key])=>differentField(local.state,incoming.state,key)).map(([section,label])=>({section,label}));
 const allowed=new Set([...Object.keys(STATE_FIELDS),'members','matches','teams','accounts']);let unknownStateSections=0;
 for(const key of new Set([...Object.keys(local.state),...Object.keys(incoming.state)]))if(!allowed.has(key)&&differentField(local.state,incoming.state,key))unknownStateSections++;
 return {accountFields,unknownAccountFields,stateSections,unknownStateSections};
}
function compare(local,incoming){
 root.FCLCContinuity.validate(local);root.FCLCContinuity.validate(incoming);
 const version=/^V(\d+)\.(\d+)\.(\d+)(?:\.(\d+))?$/;
 const a=version.exec(QA_BUILD),b=version.exec(incoming.build||'');
 if(!b)throw Error('Version de la sauvegarde absente ou non reconnue.');
 for(let i=1;i<=4;i++){const d=Number(b[i]||0)-Number(a[i]||0);if(d>0)throw Error('Sauvegarde créée par une version plus récente : mettre à jour l’application avant comparaison.');if(d<0)break;}
 const collections={};let differences=0;
 for(const key of ['members','matches','teams','accounts']){
  const l=new Map(local.state[key].map(x=>[x.id,x])),r=new Map(incoming.state[key].map(x=>[x.id,x]));let same=0,changed=0,added=0,absent=0;
  for(const [id,row] of r){if(!l.has(id))added++;else if(stable(l.get(id))===stable(row))same++;else changed++;}
  for(const id of l.keys())if(!r.has(id))absent++;
  collections[key]={same,changed,added,absent};differences+=changed+added+absent;
 }
 const extraLocal={...local.state},extraIncoming={...incoming.state};for(const key of Object.keys(collections)){delete extraLocal[key];delete extraIncoming[key];}
 const otherStateChanged=stable(extraLocal)!==stable(extraIncoming),lineupsChanged=stable(local.lineups)!==stable(incoming.lineups),feedbackChanged=stable(local.feedback||[])!==stable(incoming.feedback||[]),scenariosChanged=stable(local.scenarios||{})!==stable(incoming.scenarios||{});
 const club=p=>String(p.state.clubProfile?.official?.affiliation||'').trim();const lc=club(local),ic=club(incoming);const clubStatus=!lc||!ic?'unknown':lc===ic?'same':'different';
 return {format:'FC_LA_COUR_TRANSFER_REVIEW',schemaVersion:2,build:QA_BUILD,sourceBuild:incoming.build,collections,differences,details:details(local,incoming),otherStateChanged,lineupsChanged,feedbackChanged,scenariosChanged,clubStatus,identical:differences===0&&!otherStateChanged&&!lineupsChanged&&!feedbackChanged&&!scenariosChanged,mode:'comparison-only',note:'Comparaison par identifiants internes. Sans ancêtre commun, une différence ne permet pas de déterminer la valeur la plus récente. Une fiche absente ne constitue pas une instruction de suppression. Aucun remplacement ni fusion effectué.'};
}
function classify(base,local,incoming){
 const b=stable(base),l=stable(local),r=stable(incoming);
 if(l===b&&r===b)return 'unchanged';
 if(l===r)return 'sameChange';
 if(l===b)return 'incomingOnly';
 if(r===b)return 'localOnly';
 return 'conflict';
}
function threeWay(base,local,incoming){
 compare(local,base);compare(local,incoming);
 const affiliation=p=>String(p.state.clubProfile?.official?.affiliation||'').trim();
 const ids=[affiliation(base),affiliation(local),affiliation(incoming)];
 if(ids.some(x=>!x)||new Set(ids).size!==1)throw Error('La référence et les deux bases doivent porter la même affiliation renseignée.');
 const collections={};let conflicts=0;
 for(const key of ['members','matches','teams','accounts']){
  const maps=[base,local,incoming].map(p=>new Map(p.state[key].map(row=>[row.id,row])));
  const counts={unchanged:0,localOnly:0,incomingOnly:0,sameChange:0,conflict:0};
  for(const id of new Set(maps.flatMap(m=>[...m.keys()]))){const kind=classify(...maps.map(m=>m.has(id)?{present:true,value:m.get(id)}:{present:false}));counts[kind]++;}
  collections[key]=counts;conflicts+=counts.conflict;
 }
 const remainder=p=>{const x={...p.state};for(const key of Object.keys(collections))delete x[key];return x;};
 const other={state:classify(...[base,local,incoming].map(remainder)),lineups:classify(base.lineups,local.lineups,incoming.lineups),feedback:classify(base.feedback||[],local.feedback||[],incoming.feedback||[]),scenarios:classify(base.scenarios||{},local.scenarios||{},incoming.scenarios||{})};
 return {referenceBuild:base.build,ancestry:'user-selected-unverified',collections,recordConflicts:conflicts,other,otherConflictGroups:Object.values(other).filter(v=>v==='conflict').length,note:'Résultat relatif à la référence choisie ; son rôle d’ancêtre commun n’est pas vérifiable dans ces sauvegardes. Conflits évalués par fiche entière ; aucune fusion, même pour des champs distincts. Les absences ne déclenchent aucune suppression.'};
}
async function loadReference(event){
 const file=event.target.files?.[0];clear();if(!file)return;const token=epoch;
 try{access();const owner=currentAdminAccount().id;
  if(file.size>30*1024*1024)throw Error('Référence trop volumineuse (maximum 30 Mo).');
  const payload=JSON.parse(await file.text());if(token!==epoch)return;
  access();if(owner!==currentAdminAccount().id||!E('transfer').classList.contains('active'))return;
  compare(qaBackupPayload(),payload);reference=payload;referenceOwner=owner;
  E('transferReferenceStatus').textContent='Référence chargée ('+payload.build+'). Choisissez maintenant la sauvegarde à comparer. Son rôle de référence commune reste à vérifier par vous.';
 }catch(e){if(token===epoch)clear('Référence refusée : '+e.message);}
}
function runChecks(){
 access();const results=[],clone=x=>JSON.parse(JSON.stringify(x));
 const base={format:'FC_LA_COUR_FULL_BACKUP',schemaVersion:1,build:QA_BUILD,state:{members:[{id:'fiction-member',first:'FICTIF',phone:'0000000000'}],matches:[],teams:[],accounts:[{id:'fiction-account',lastLoginAt:'2000-01-01'}],clubProfile:{official:{affiliation:'000000'}}},lineups:{},feedback:[],scenarios:{}};
 const check=(name,fn)=>{try{if(!fn())throw Error();results.push({name,passed:true});}catch(e){results.push({name,passed:false});}};
 const rejects=fn=>{try{fn();return false;}catch(e){return true;}};
 check('Deux bases identiques',()=>compare(base,clone(base)).identical);
 check('Trois bases inchangées',()=>threeWay(base,base,clone(base)).collections.members.unchanged===1);
 check('Modification locale seule',()=>{const l=clone(base);l.state.members[0].phone='LOCAL';return threeWay(base,l,base).collections.members.localOnly===1;});
 check('Modification du fichier seule',()=>{const r=clone(base);r.state.members[0].phone='RECU';return threeWay(base,base,r).collections.members.incomingOnly===1;});
 check('Même modification des deux côtés',()=>{const l=clone(base);l.state.members[0].phone='COMMUN';return threeWay(base,l,clone(l)).collections.members.sameChange===1;});
 check('Modifications différentes à arbitrer',()=>{const l=clone(base),r=clone(base);l.state.members[0].phone='LOCAL';r.state.members[0].phone='RECU';return threeWay(base,l,r).collections.members.conflict===1;});
 check('Absence et modification à arbitrer',()=>{const l=clone(base),r=clone(base);l.state.members=[];r.state.members[0].phone='RECU';return threeWay(base,l,r).collections.members.conflict===1;});
 check('Identifiant dupliqué refusé',()=>{const r=clone(base);r.state.members.push(clone(r.state.members[0]));return rejects(()=>threeWay(base,base,r));});
 check('Affiliation différente refusée',()=>{const r=clone(base);r.state.clubProfile.official.affiliation='999999';return rejects(()=>threeWay(base,base,r));});
 check('Version future refusée',()=>{const r=clone(base);r.build='V999.0.0';return rejects(()=>compare(base,r));});
 check('Date de connexion identifiée',()=>{const r=clone(base);r.state.accounts[0].lastLoginAt='2001-01-01';return compare(base,r).details.accountFields.some(x=>x.field==='lastLoginAt');});
 check('Valeurs et clés libres absentes du bilan',()=>{const r=clone(base);r.state.accounts[0]['DONNEE_PRIVEE_TEST']='VALEUR_PRIVEE_TEST';const out=JSON.stringify(compare(base,r));return !out.includes('DONNEE_PRIVEE_TEST')&&!out.includes('VALEUR_PRIVEE_TEST');});
 const box=E('transferChecks');box.replaceChildren();const title=document.createElement('p');title.textContent=results.filter(r=>r.passed).length+' / '+results.length+' contrôles réussis — données fictives uniquement.';box.append(title);const list=document.createElement('ul');for(const r of results){const li=document.createElement('li');li.textContent=(r.passed?'Réussi : ':'Échec : ')+r.name;list.append(li);}box.append(list);return results;
}
function renderThree(result){
 const h=document.createElement('h3');h.textContent='Évolution par rapport à la référence choisie';E('transferResult').append(h);
 const table=document.createElement('table');table.className='table';const head=document.createElement('thead'),hr=document.createElement('tr');
 for(const label of ['Collection','Inchangées','Base actuelle seule','Fichier seul','Même changement','À arbitrer']){const th=document.createElement('th');th.scope='col';th.textContent=label;hr.append(th);}head.append(hr);table.append(head);const body=document.createElement('tbody');
 for(const [key,label] of [['members','Licenciés'],['matches','Matchs'],['teams','Équipes'],['accounts','Comptes']]){const row=document.createElement('tr'),c=result.collections[key];for(const v of [label,c.unchanged,c.localOnly,c.incomingOnly,c.sameChange,c.conflict]){const td=document.createElement('td');td.textContent=String(v);row.append(td);}body.append(row);}table.append(body);E('transferResult').append(table);
 const labels={unchanged:'inchangé',localOnly:'base actuelle seule',incomingOnly:'fichier seul',sameChange:'même changement',conflict:'à arbitrer'};
 const p=document.createElement('p');p.textContent='Autres rubriques (ensemble) : '+labels[result.other.state]+' · Compositions : '+labels[result.other.lineups]+' · Retours : '+labels[result.other.feedback]+' · Scénarios : '+labels[result.other.scenarios]+'.';E('transferResult').append(p);
 const note=document.createElement('p');note.textContent=result.note;E('transferResult').append(note);
}
function disk(){return JSON.stringify([KEY,'fclc_coach_lineups',PROTOTYPE_FEEDBACK_KEY,PROTOTYPE_SCENARIO_KEY].map(k=>localStorage.getItem(k)));}
function clear(message='',keepReference=false){epoch++;review=null;E('transferResult').replaceChildren();E('transferExport').disabled=true;E('transferStatus').textContent=message;E('transferFile').value='';if(!keepReference){reference=null;referenceOwner=null;E('transferReference').value='';E('transferReferenceStatus').textContent='Sans référence : comparaison entre deux bases.';}}

function fresh(){access();if(!review||review.owner!==currentAdminAccount().id||review.memory!==stable(contents(qaBackupPayload()))||review.disk!==disk())throw Error('La base ou le compte a changé. Rechargez la sauvegarde pour refaire la comparaison.');return review.report;}
async function load(event){
 const file=event.target.files?.[0];if(!file)return;clear('Lecture de la sauvegarde…',true);const token=epoch;
 try{
  access();const owner=currentAdminAccount().id,local=qaBackupPayload(),memory=stable(contents(local)),saved=disk();
  if(file.size>30*1024*1024)throw Error('Fichier trop volumineux (maximum 30 Mo).');
  const incoming=JSON.parse(await file.text());
  if(token!==epoch)return;access();if(owner!==currentAdminAccount().id||memory!==stable(contents(qaBackupPayload()))||saved!==disk()||!E('transfer').classList.contains('active'))throw Error('Le contexte a changé pendant la lecture. Recommencez la comparaison.');
  const report=compare(local,incoming);if(reference){if(referenceOwner!==owner)throw Error('Compte différent : recharger la référence.');report.threeWay=threeWay(reference,local,incoming);report.schemaVersion=3;}review={report,owner,memory,disk:saved};
  const table=document.createElement('table');table.className='table';const head=document.createElement('thead'),hr=document.createElement('tr');for(const label of ['Collection','Identiques','Différentes','Dans le fichier seulement','Dans la base seulement']){const th=document.createElement('th');th.scope='col';th.textContent=label;hr.append(th);}head.append(hr);table.append(head);const body=document.createElement('tbody');
  for(const [key,label] of [['members','Licenciés'],['matches','Matchs'],['teams','Équipes'],['accounts','Comptes']]){const tr=document.createElement('tr'),r=report.collections[key];for(const value of [label,r.same,r.changed,r.added,r.absent]){const td=document.createElement('td');td.textContent=String(value);tr.append(td);}body.append(tr);}table.append(body);E('transferResult').append(table);
  const p=document.createElement('p');p.textContent='Autres paramètres de la base : '+(report.otherStateChanged?'différents':'identiques')+' · Compositions : '+(report.lineupsChanged?'différentes':'identiques')+' · Retours de test : '+(report.feedbackChanged?'différents':'identiques')+' · Scénarios : '+(report.scenariosChanged?'différents':'identiques')+'.';E('transferResult').append(p);
  const heading=document.createElement('h3');heading.textContent='Champs et rubriques concernés';E('transferResult').append(heading);
  const list=document.createElement('ul');
  for(const field of report.details.accountFields){const li=document.createElement('li');li.textContent='Comptes — '+field.label+' : '+field.count+' compte(s) concerné(s).';list.append(li);}
  for(const section of report.details.stateSections){const li=document.createElement('li');li.textContent=section.label+' : contenu différent.';list.append(li);}
  if(report.details.unknownAccountFields||report.details.unknownStateSections){const li=document.createElement('li');li.textContent='Autres champs non répertoriés : '+report.details.unknownAccountFields+' différence(s) de champs de comptes et '+report.details.unknownStateSections+' rubrique(s) de base. Leurs noms et valeurs ne sont pas exportés.';list.append(li);}
  if(!list.children.length){const li=document.createElement('li');li.textContent='Aucune différence de champs sur les comptes communs ni dans les autres rubriques de la base.';list.append(li);}
  E('transferResult').append(list);
  const explanation=document.createElement('p');explanation.textContent='Une date de connexion ou un journal peut changer pendant l’utilisation. Ce bilan indique les champs concernés, sans prouver la cause du changement ni autoriser son remplacement. Les comptes ajoutés ou absents restent comptés dans le tableau.';E('transferResult').append(explanation);
  if(report.threeWay)renderThree(report.threeWay);
  E('transferStatus').textContent=(report.identical?'Contenu identique. ':'Différences à examiner. ')+({same:'Affiliation concordante.',different:'Affiliations différentes : ne pas transférer cette base vers le club actuel.',unknown:'Affiliation manquante : appartenance au club non vérifiée.'})[report.clubStatus]+' Aucune donnée modifiée.';E('transferExport').disabled=false;
 }catch(e){if(token===epoch)clear('Comparaison arrêtée : '+e.message);}
}
function download(){try{const r=fresh();prototypeDownloadText('FC_LA_COUR_comparaison_transfert_'+new Date().toISOString().replace(/[:.]/g,'-')+'.json',JSON.stringify({...r,generatedAt:new Date().toISOString()},null,2),'application/json');}catch(e){clear(e.message);}}
E('transferReference').addEventListener('change',loadReference);
E('transferFile').addEventListener('change',load);
const prevGo=goTo;goTo=function(target){if(target!=='transfer')clear();return prevGo.apply(this,arguments);};
const prevSpace=qaSetSpace;qaSetSpace=function(){const result=prevSpace.apply(this,arguments);if(!allowed())clear();return result;};
const prevRender=renderAll;renderAll=function(){const result=prevRender.apply(this,arguments);if(review)try{fresh();}catch(e){clear(e.message);}return result;};
window.addEventListener('storage',e=>{if([KEY,'fclc_coach_lineups',PROTOTYPE_FEEDBACK_KEY,PROTOTYPE_SCENARIO_KEY,null].includes(e.key))clear('Une autre fenêtre a modifié les données. Refaire la comparaison.');});
PAGE_PERMISSION_MODULE.transfer='settings';ADMIN_PAGE_TITLES.transfer='Comparer avant transfert';root.FCLCTransfer=Object.freeze({compare,threeWay,runChecks,loadReference,load,download,clear});
})(globalThis);


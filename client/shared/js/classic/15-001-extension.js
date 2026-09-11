
(function(root){
 'use strict';
 function fixture(){
  const s={schema:'footclubs-ui/source-capture/1',generator:{name:'Footclubs UI',version:'0.08.8'},capturedAt:new Date().toISOString(),source:{origin:'https://footclubs.fff.fr',path:'/extrafoot/EX_PERSONNE.Ident',kind:'person',title:'EXEMPLE FICTIF — Contacts',frame:'work',selection:{mode:'page',tag:'BODY'},context:{affiliation:'000000',season:'2026'}},coverage:{scope:'rendered-dom',completeDataset:false,originalFileIncluded:false,truncated:false,uncommittedValuesPossible:true},safety:{readOnly:true,containsPersonalData:true,includesRawHtml:false,includesSessionData:false,missingRowsMeanDeletion:false},blocks:[{type:'text',text:'Monsieur EXEMPLE Alex'},{type:'text',text:'Numéro personne'},{type:'text',text:'9999999999'},{type:'text',text:'Né(e) le 01/01/2000 à Ville fictive'},{type:'table',title:'Contacts',columns:['Suppr','Type de contact','Contact','Diffusion'],rows:[['Non cochée','Email principal','@ alex@example.invalid','Non diffusables'],['Non cochée','Mobile personnel','0000000000','Non diffusables']]},{type:'table',title:'Licences',columns:['Saison','Sous-catégorie','Ligue','Club','Club','Licence enregistrée','Etat'],rows:[['2026','Dirigeant','0000','000000','CLUB FICTIF','01/01/2026','Validée']]}],references:[],structure:{}};
  s.structure=root.LaCourSelectedSource.structure(s.blocks);
  const db={members:[{id:'test-only',personNumber:'9999999999',licenseNumber:'LICENCE-FICTIVE',last:'EXEMPLE',first:'Alex',birthDate:'2000-01-01',email:'ancien@example.invalid',mobile:'0000000000',phone:'0000000000',sourceData:{original:'conservé'}}],clubProfile:{official:{affiliation:'000000'}},matches:[{id:'match-test',attendance:['test-only']}],teams:[{id:'team-test',players:['test-only']}],coachLineups:{test:['test-only']},auditLog:[]};
  return {s,db};
 }
 function run(){
  const C=root.FCUContactsCore,results=[];
  function test(label,fn){try{fn();results.push({label,ok:true});}catch(e){results.push({label,ok:false,code:'TEST_ECHOUE'});}}
  const check=(v)=>{if(!v)throw Error('Assertion');},refuses=fn=>{let rejected=false;try{fn();}catch(e){rejected=true;}check(rejected);};
  test('Comparaison sans écriture',()=>{const {db,s}=fixture(),before=C.stable(db),p=C.plan(db,s,'2026');check(p.canApply&&p.changes.length===2);check(C.stable(db)===before);});
  test('Choix explicite des champs',()=>{const {db,s}=fixture(),p=C.plan(db,s,'2026');refuses(()=>C.apply(db,s,p,[],'test'));refuses(()=>C.apply(db,s,p,['licenseNumber'],'test'));});
  test('Application limitée aux contacts choisis',()=>{const {db,s}=fixture(),p=C.plan(db,s,'2026'),r=C.apply(db,s,p,['email'],'test').state;check(r.members[0].email==='alex@example.invalid'&&r.members[0].mobile===db.members[0].mobile);check(r.members[0].licenseNumber===db.members[0].licenseNumber&&C.stable(r.members[0].sourceData)===C.stable(db.members[0].sourceData));});
  test('Compositions et présences préservées',()=>{const {db,s}=fixture(),p=C.plan(db,s,'2026'),r=C.apply(db,s,p,['email','mobile'],'test').state;for(const k of ['matches','teams','coachLineups'])check(C.stable(r[k])===C.stable(db[k]));});
  test('Réimport sans nouvelle modification',()=>{const {db,s}=fixture(),p=C.plan(db,s,'2026'),r=C.apply(db,s,p,['email','mobile'],'test').state;check(C.plan(r,s,'2026').changes.length===0);});
  test('Annulation fidèle et journal conservé',()=>{const {db,s}=fixture(),r=C.apply(db,s,C.plan(db,s,'2026'),['email'],'test'),u=C.undo(r.state,r.transaction.id,'test');check(C.stable(u.members)===C.stable(db.members));check(u.footclubsContacts.history[0].undone&&u.auditLog.length===2);});
  test('Annulation bloquée après modification de fiche',()=>{const {db,s}=fixture(),r=C.apply(db,s,C.plan(db,s,'2026'),['email'],'test');r.state.members[0].phone='0000000000';refuses(()=>C.undo(r.state,r.transaction.id,'test'));});
  for(const [label,mutate,code] of [
   ['Mauvais club',x=>x.s.source.context.affiliation='111111','CLUB_SOURCE'],
   ['Mauvaise saison',x=>x.s.source.context.season='2025','SAISON_SOURCE'],
   ['Doublon de personne',x=>x.db.members.push({...x.db.members[0],id:'autre'}),'CANDIDATS'],
   ['Naissance différente',x=>x.db.members[0].birthDate='2000-01-02','NAISSANCE'],
   ['Nom différent',x=>x.db.members[0].first='Autre','NOM'],
   ['Capture ancienne',x=>x.s.capturedAt=new Date(Date.now()-40*86400000).toISOString(),'ANCIENNETE'],
   ['Capture future',x=>x.s.capturedAt=new Date(Date.now()+86400000).toISOString(),'HORODATAGE'],
   ['Capture tronquée',x=>x.s.coverage.truncated=true,'TRONCATURE'],
   ['Identité absente',x=>{x.s.blocks=x.s.blocks.filter(b=>b.type!=='text');x.s.structure=root.LaCourSelectedSource.structure(x.s.blocks);},'PERSONNE']
  ])test(label+' : refus',()=>{const x=fixture();mutate(x);const p=C.plan(x.db,x.s,'2026');check(!p.canApply&&p.issues.some(i=>i.code===code));});
  test('Comparaison périmée : refus',()=>{const {db,s}=fixture(),p=C.plan(db,s,'2026');db.members[0].email='nouveau@example.invalid';refuses(()=>C.apply(db,s,p,['email'],'test'));});
  test('Champ absent : aucune suppression',()=>{const {db,s}=fixture();s.blocks.find(b=>b.title==='Contacts').rows=s.blocks.find(b=>b.title==='Contacts').rows.slice(1);s.structure=root.LaCourSelectedSource.structure(s.blocks);check(!C.plan(db,s,'2026').changes.some(c=>c.key==='email'));});
  return {build:'1.22.13',at:new Date().toISOString(),passed:results.filter(x=>x.ok).length,total:results.length,results};
 }
 function show(){
  if(!document.getElementById('footclubsui').classList.contains('active')||!currentAdminCan('imports','view'))return;
  const r=run(),box=document.getElementById('fcuQualificationResults');box.replaceChildren();
  const p=document.createElement('p');p.textContent=r.passed+'/'+r.total+' contrôles réussis sur données fictives. Aucun accès à la base du club par ces tests.';box.append(p);
  const list=document.createElement('ul');r.results.forEach(x=>{const li=document.createElement('li');li.textContent=(x.ok?'✓ ':'ÉCHEC — ')+x.label;list.append(li);});box.append(list);
 }
 root.FCUQualification=Object.freeze({run,show,fixture});
})(globalThis);


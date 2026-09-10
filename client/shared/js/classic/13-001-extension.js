
/* Contacts only: a person identifier never becomes a licence identifier. */
(function(root){
 'use strict';
 const clone=x=>JSON.parse(JSON.stringify(x));
 const stable=x=>JSON.stringify(x,function(k,v){return v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v;});
 const text=x=>String(x??'').trim();
 const norm=x=>text(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').toUpperCase();
 const fail=(code,message)=>{const e=new Error(message);e.code=code;throw e;};
 function date(x){let v=text(x),m=v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);if(m)v=m[3]+'-'+m[2]+'-'+m[1];if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return '';const d=new Date(v+'T00:00:00Z');return Number.isFinite(+d)&&d.toISOString().slice(0,10)===v?v:'';}
 const fields={mobile:{label:'Mobile personnel et téléphone affiché',keys:['mobile','phone']},email:{label:'Email principal',keys:['email']},homePhone:{label:'Téléphone domicile',keys:['homePhone']},workPhone:{label:'Téléphone travail',keys:['workPhone']}};
 const contactTypes={'Mobile personnel':'mobile','Email principal':'email','Téléphone domicile':'homePhone','Téléphone travail':'workPhone'};
 function extract(s){
  const valid=root.NeoFootclubsSourceContract.validate(s);if(!valid.ok)fail('FORMAT','Capture non valide.');
  if(s.source.kind!=='person'||s.source.path!=='/extrafoot/EX_PERSONNE.Ident')fail('TYPE','Le rapprochement nécessite une fiche personne.');
  const ids=[],births=[],names=[],contacts={},issues=[];
  s.blocks.forEach((b,i)=>{
   if(b.type!=='text')return;const t=text(b.text);
   if(t==='Numéro personne'){const n=s.blocks[i+1];ids.push(n?.type==='text'?text(n.text):'');}
   else if(/^Numéro personne\s*:/.test(t))ids.push(t.replace(/^Numéro personne\s*:\s*/,''));
   const birth=t.match(/^Né\(e\) le (\d{2}\/\d{2}\/\d{4})(?:\s|$)/);if(birth)births.push(date(birth[1]));
   const name=t.match(/^(?:Monsieur|Madame)\s+(.+)$/);if(name)names.push(name[1]);
  });
  if(ids.length!==1||!/^\d{8,12}$/.test(ids[0]))issues.push({code:'PERSONNE',message:'Numéro personne absent, ambigu ou non reconnu.'});
  if(births.length!==1||!births[0])issues.push({code:'NAISSANCE_SOURCE',message:'Date de naissance source absente ou ambiguë.'});
  if(names.length!==1)issues.push({code:'NOM_SOURCE',message:'Nom source absent ou ambigu.'});
  const tables=s.blocks.filter(b=>b.type==='table'&&b.title==='Contacts');
  if(tables.length!==1)issues.push({code:'CONTACTS',message:'Un tableau Contacts unique est nécessaire.'});
  else{
   const b=tables[0],cols=b.columns,expected=['Suppr','Type de contact','Contact','Diffusion'];
   const plain=['Type de contact','Contact','Diffusion'];
   if(stable(cols)!==stable(expected)&&stable(cols)!==stable(plain))issues.push({code:'COLONNES',message:'Colonnes de contacts non reconnues.'});
   else{
    const type=cols.indexOf('Type de contact'),value=cols.indexOf('Contact'),del=cols.indexOf('Suppr');
    for(const row of b.rows){
     if(!Object.hasOwn(contactTypes,row[type]))continue;const key=contactTypes[row[type]];
     if(Object.hasOwn(contacts,key)){issues.push({code:'CONTACT_DOUBLE',message:fields[key].label+' présent plusieurs fois.'});continue;}
     let raw=text(row[value]),v=raw;contacts[key]={raw,value:'',valid:false};
     if(del>=0&&!['','Non cochée'].includes(text(row[del]))){issues.push({code:'CONTACT_COCHE',message:'Une commande de suppression est cochée dans la capture.'});continue;}
     if(!v)continue;
     if(key==='email'){v=v.replace(/^@\s+/,'');if(!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v)||v.length>254){issues.push({code:'EMAIL',message:'Email capturé non reconnu : aucune correction devinée.'});continue;}}
     else{v=v.replace(/[\s().-]/g,'');if(!/^\+?\d{8,15}$/.test(v)){issues.push({code:'TELEPHONE',message:'Numéro de téléphone capturé non reconnu.'});continue;}}
     contacts[key]={raw,value:v,valid:true};
    }
   }
  }
  const affiliations=[];
  for(const b of s.blocks.filter(b=>b.type==='table'&&b.title==='Licences')){
   const known=['Saison','Sous-catégorie','Ligue','Club','Club','Licence enregistrée','Etat'];
   if(stable(b.columns)!==stable(known)&&stable(b.columns)!==stable([...known,'Départ']))continue;
   b.rows.forEach(r=>{if(/^\d{6}$/.test(r[3]))affiliations.push({season:r[0],club:r[3]});});
  }
  return {personNumber:ids[0]||'',birthDate:births[0]||'',name:names[0]||'',contacts,affiliations,issues};
 }
 function context(db,season){const profile={...(db.clubProfile?.official||{}),...(db.clubProfile?.manual||{})};return {club:text(profile.affiliation),season:text(season)};}
 function plan(db,s,season,now=Date.now()){
  const source=extract(s),issues=[...source.issues],ctx=context(db,season);
  const add=(code,message)=>issues.push({code,message});
  if(!/^\d{6}$/.test(ctx.club))add('CLUB_LOCAL','Renseigner une affiliation valide dans Paramétrage du club.');
  if(!/^\d{4}(?:-\d{4})?$/.test(ctx.season))add('SAISON_LOCALE','Indiquer la saison de travail avant de comparer.');
  if(s.source.context.affiliation!==ctx.club)add('CLUB_SOURCE','Le club de la capture ne correspond pas au club paramétré.');
  if(s.source.context.season!==ctx.season)add('SAISON_SOURCE','La saison de la capture ne correspond pas à la saison de travail.');
  if(!source.affiliations.some(x=>x.club===ctx.club&&x.season===ctx.season))add('APPARTENANCE','Aucune ligne de licence capturée ne confirme ce club pour cette saison. Charger la fiche avec Identité, Contacts et Licences.');
  if(s.coverage.truncated)add('TRONCATURE','Capture tronquée : refaire une collecte complète de la fiche affichée.');
  const age=now-Date.parse(s.capturedAt),limit=Number(db.importFreshness?.members)||30;
  if(!Number.isFinite(age)||age< -300000)add('HORODATAGE','Date de capture invalide ou située dans le futur. Vérifier les horloges.');
  if(age>Math.max(1,Math.min(365,limit))*86400000)add('ANCIENNETE','Capture trop ancienne selon le seuil de fraîcheur des licenciés. Refaire la collecte.');
  const candidates=(db.members||[]).filter(m=>text(m.personNumber)===source.personNumber&&source.personNumber);
  if(candidates.length!==1)add('CANDIDATS',candidates.length?'Plusieurs lignes locales portent ce numéro personne. Rapprochement des licences nécessaire avant toute modification.':'Aucune fiche locale trouvée par numéro personne. Importer d’abord le fichier de licences de référence.');
  const member=candidates.length===1?candidates[0]:null;
  if(member){
   if(!member.id||(db.members||[]).filter(m=>m.id===member.id).length!==1)add('ID_LOCAL','Identifiant local absent ou dupliqué.');
   if(!date(member.birthDate)||date(member.birthDate)!==source.birthDate)add('NAISSANCE','Date de naissance locale absente ou différente.');
   if(!norm(member.fullName||`${member.last||''} ${member.first||''}`)||norm(member.fullName||`${member.last||''} ${member.first||''}`)!==norm(source.name))add('NOM','Le nom local et le nom capturé diffèrent : contrôle manuel nécessaire.');
   const latest=member.footclubsContactSource?.capturedAt;
   if(latest&&Date.parse(s.capturedAt)<Date.parse(latest))add('REGRESSION','Une capture plus récente a déjà été appliquée à cette fiche.');
  }
  const changes=[];
  if(member)for(const [key,f] of Object.entries(fields)){
   const c=source.contacts[key];if(!c?.valid||!c.value)continue;
   const writes={};for(const k of f.keys){const old=text(member[k]),normal=k==='email'?old:old.replace(/[\s().-]/g,'');if(normal!==c.value)writes[k]=c.value;}
   if(Object.keys(writes).length)changes.push({key,label:f.label,raw:c.raw,value:c.value,writes,before:Object.fromEntries(f.keys.map(k=>[k,member[k]??'']))});
  }
  return {source,context:ctx,capturedAt:s.capturedAt,memberId:member?.id||null,candidateCount:candidates.length,issues,changes,canApply:issues.length===0&&changes.length>0,baseline:stable(db),snapshot:stable(s)};
 }
 function apply(db,s,review,keys,actor,at=new Date().toISOString(),id='fcu-'+Date.now()){
  if(stable(db)!==review.baseline||stable(s)!==review.snapshot)fail('PLAN_PERIME','Les données ont changé depuis la comparaison. Recommencer le contrôle.');
  const fresh=plan(db,s,review.context.season,Date.parse(at));
  if(!fresh.canApply)fail('CONTROLE',fresh.issues.map(x=>x.message).join(' ')||'Aucun écart à appliquer.');
  if(!Array.isArray(keys)||!keys.length||new Set(keys).size!==keys.length||keys.some(k=>!fresh.changes.some(c=>c.key===k)))fail('CHOIX','Choisir uniquement des champs proposés dans la comparaison.');
  const next=clone(db),member=next.members.find(m=>m.id===fresh.memberId),before=clone(member),accepted=fresh.changes.filter(c=>keys.includes(c.key));
  accepted.forEach(c=>Object.assign(member,c.writes));
  member.footclubsContactSource={capturedAt:s.capturedAt,appliedAt:at,origin:s.source.origin,path:s.source.path,affiliation:fresh.context.club,season:fresh.context.season,fields:accepted.map(c=>c.key)};
  const transaction={id,at,actor:text(actor),memberId:member.id,capturedAt:s.capturedAt,fields:accepted.map(c=>c.key),before,after:clone(member),undone:false};
  next.footclubsContacts=next.footclubsContacts||{schema:1,history:[]};
  next.footclubsContacts.history=[transaction,...(next.footclubsContacts.history||[])].slice(0,30);
  next.auditLog=next.auditLog||[];next.auditLog.unshift({id:id+'-audit',at,accountId:text(actor),user:text(actor),module:'Footclubs — contacts',action:'Application contrôlée',detail:accepted.length+' rubrique(s) de contact ; fiche '+member.id});
  return {state:next,transaction};
 }
 function undo(db,id,actor,at=new Date().toISOString()){
  const history=db.footclubsContacts?.history||[],tx=history.find(t=>t.id===id&&!t.undone);
  if(!tx)fail('ANNULATION','Cette opération est absente ou déjà annulée.');
  const matches=(db.members||[]).filter(m=>m.id===tx.memberId);
  if(matches.length!==1||stable(matches[0])!==stable(tx.after))fail('CONFLIT_ANNULATION','La fiche a changé depuis cette opération. Annulation bloquée pour préserver les modifications ultérieures.');
  const next=clone(db),index=next.members.findIndex(m=>m.id===tx.memberId);next.members[index]=clone(tx.before);
  const row=next.footclubsContacts.history.find(t=>t.id===id);row.undone=true;row.undoneAt=at;row.undoneBy=text(actor);
  next.auditLog=next.auditLog||[];next.auditLog.unshift({id:id+'-undo',at,accountId:text(actor),user:text(actor),module:'Footclubs — contacts',action:'Annulation contrôlée',detail:'Fiche '+tx.memberId});
  return next;
 }
 root.FCUContactsCore=Object.freeze({extract,plan,apply,undo,stable,clone,fields,date});
})(globalThis);


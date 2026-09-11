
(function(root){
 'use strict';
 const schema='la-cour-manager/selected-source/1';
 const labels=Object.freeze({identity:'Identité',address:'Adresse',preferences:'Préférences FFF',contacts:'Contacts',guardians:'Représentants légaux',licences:'Historique des licences',other:'Autres informations à vérifier'});
 const clone=x=>JSON.parse(JSON.stringify(x));
 function sections(p){
  if(p.source.kind!=='person'||p.source.path!=='/extrafoot/EX_PERSONNE.Ident')throw Error('La sélection de rubriques nécessite une capture de fiche personne.');
  const out=Object.fromEntries(Object.keys(labels).map(k=>[k,[]]));
  for(let i=0;i<p.blocks.length;i++){
   const b=p.blocks[i];let key='other';
   if(b.type==='table')key=({'Contacts':'contacts','Représentants légaux':'guardians','Licences':'licences'})[b.title]||'other';
   else {
    const t=b.text.trim();
    if(t===p.source.title||['Valider','Rafraîchir','Créer représentant légal'].includes(t)||t.startsWith('Droits de reproduction et de diffusion réservés © Fédération Française de Football'))continue;
    if(t==='Numéro personne'&&p.blocks[i+1]?.type==='text'&&/^\d{1,12}$/.test(p.blocks[i+1].text.trim())){out.identity.push(i,++i);continue;}
    if(t==='Nationalité'&&p.blocks[i+1]?.type==='text'&&p.blocks[i+1].text.trim()==='Française'){out.identity.push(i,++i);continue;}
    if(/^(Monsieur |Madame |Né\(e\) le )/.test(t))key='identity';
    else if(/^(Voie-rue |Bureau distributeur |Pays étranger ou DOM-TOM )/.test(t))key='address';
    else if(/^(Non cochée|Cochée) (Souhaite être informé|Ne souhaite pas que ses coordonnées)/.test(t))key='preferences';
   }
   out[key].push(i);
  }
  return out;
 }
 function structure(blocks){
  const input=blocks.map(b=>b.type==='table'?'table:'+b.columns.join('|'):'text').join(';');let hash=2166136261;
  for(let i=0;i<input.length;i++){hash^=input.charCodeAt(i);hash=Math.imul(hash,16777619);}
  return {method:'fnv1a-layout-v1',fingerprint:(hash>>>0).toString(16).padStart(8,'0'),tableCount:blocks.filter(b=>b.type==='table').length,rowCount:blocks.reduce((n,b)=>n+(b.type==='table'?b.rows.length:0),0),textCharacters:blocks.reduce((n,b)=>n+(b.type==='text'?b.text.length:b.rows.flat().reduce((a,s)=>a+s.length,0)),0)};
 }
 function build(p,keys){
  const valid=NeoFootclubsSourceContract.validate(p);if(!valid.ok)throw Error(valid.errors.join(' · '));
  const groups=sections(p);
  if(!Array.isArray(keys)||!keys.length||new Set(keys).size!==keys.length||keys.some(k=>!Object.hasOwn(labels,k)||!groups[k].length))throw Error('Choisir au moins une rubrique disponible.');
  const included=new Set(keys.flatMap(k=>groups[k]));const capture=clone(p);
  capture.blocks=p.blocks.filter((_,i)=>included.has(i)).map(clone);capture.references=[];
  capture.source.title='Sélection de rubriques — fiche personne';capture.structure=structure(capture.blocks);
  return {schema,generator:{name:'CLUB EXEMPLE Manager',version:'1.22.13'},exportedAt:new Date().toISOString(),selection:{sections:Object.keys(labels).filter(k=>keys.includes(k)),originalBlockCount:p.blocks.length},capture};
 }
 function validate(v){
  const errors=[];const exact=(o,ks)=>o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).length===ks.length&&ks.every(k=>Object.hasOwn(o,k));
  if(!exact(v,['schema','generator','exportedAt','selection','capture']))return {ok:false,errors:['Structure de sélection invalide.']};
  if(v.schema!==schema||!exact(v.generator,['name','version'])||v.generator.name!=='CLUB EXEMPLE Manager'||!['1.22.10','1.22.13'].includes(v.generator.version))errors.push('Producteur ou version de sélection non pris en charge.');
  if(typeof v.exportedAt!=='string'||!/^\d{4}-\d\d-\d\dT/.test(v.exportedAt)||!Number.isFinite(Date.parse(v.exportedAt)))errors.push('Date de sélection invalide.');
  if(!exact(v.selection,['sections','originalBlockCount']))errors.push('Métadonnées de sélection invalides.');
  const keys=v.selection?.sections;
  if(!Array.isArray(keys)||!keys.length||keys.length>7||new Set(keys).size!==keys.length||keys.some(k=>!Object.hasOwn(labels,k)))errors.push('Rubriques invalides.');
  const checked=NeoFootclubsSourceContract.validate(v.capture);errors.push(...checked.errors);
  if(checked.ok){
   const p=v.capture;
   if(!Number.isSafeInteger(v.selection?.originalBlockCount)||v.selection.originalBlockCount<p.blocks.length||v.selection.originalBlockCount>160)errors.push('Nombre initial de blocs invalide.');
   if(p.references.length||!p.blocks.length||p.source.title!=='Sélection de rubriques — fiche personne')errors.push('Contenu de sélection inattendu.');
   try{const groups=sections(p);if(Array.isArray(keys)&&keys.every(k=>Object.hasOwn(labels,k))){const selected=keys.flatMap(k=>groups[k]);if(selected.length!==p.blocks.length||keys.some(k=>!groups[k].length))errors.push('Les blocs ne correspondent pas aux rubriques déclarées.');}}catch(e){errors.push(e.message);}
   if(p.structure.fingerprint!==structure(p.blocks).fingerprint)errors.push('Empreinte de sélection incohérente.');
  }
  return {ok:errors.length===0,errors};
 }
 function parse(text){if(typeof text!=='string'||new TextEncoder().encode(text).length>1500000)throw Error('Sélection trop volumineuse (1,5 Mo).');let v;try{v=JSON.parse(text);}catch(e){throw Error('JSON de sélection invalide.');}const r=validate(v);if(!r.ok)throw Error(r.errors.slice(0,4).join(' · '));return v;}
 root.GenericClubSelectedSource=Object.freeze({schema,labels,sections,structure,build,validate,parse});
})(globalThis);


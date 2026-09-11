
/* Preparatory module, not a replacement for Gestion Club's import engine.
   Browser: GenericClubFootclubsSource.mount(container, snapshot)
   Node: require('./gestion-club-footclubs-source.js').validate(snapshot) */
(function(root){
  'use strict';
  const SCHEMA='footclubs-ui/page-snapshot/1', MAX_BYTES=5*1024*1024;
  const plain=v=>v!==null && typeof v==='object' && !Array.isArray(v) && [Object.prototype,null].includes(Object.getPrototypeOf(v));
  function validate(value){
    const errors=[];const fail=s=>errors.push(s);
    function obj(v,allowed,path){if(!plain(v)){fail(path+' : objet attendu');return false;}if(Object.keys(v).some(k=>!allowed.includes(k)))fail(path+' : propriété non autorisée');return true;}
    function str(v,path,max=5000){if(typeof v!=='string'||v.length>max)fail(path+' : texte invalide');}
    function num(v,path){if(!Number.isSafeInteger(v)||v<0)fail(path+' : entier positif attendu');}
    function id(v,path){if(v!==null && (typeof v!=='string'||!/^\d{1,12}$/.test(v)))fail(path+' : identifiant invalide');}
    if(!obj(value,['schema','generator','capturedAt','source','target','coverage','safety','columns','rows'],'capture'))return {ok:false,errors};
    if(value.schema!==SCHEMA)fail('Schéma non pris en charge');
    if(obj(value.generator,['name','version'],'generator')){if(value.generator.name!=='Footclubs UI')fail('Générateur inattendu');str(value.generator.version,'version',24);}
    if(typeof value.capturedAt!=='string'||!/^\d{4}-\d\d-\d\dT/.test(value.capturedAt)||!Number.isFinite(Date.parse(value.capturedAt)))fail('Horodatage invalide');
    const s=value.source;
    if(obj(s,['origin','path','gridId','frame','title','context'],'source')){
      if(s.origin!=='https://footclubs.fff.fr')fail('Domaine source non autorisé');
      if(typeof s.path!=='string'||!/^\/extrafoot\/[a-z0-9_.-]+$/i.test(s.path))fail('Chemin source invalide ou contenant des paramètres');
      if(typeof s.gridId!=='string'||!/^\w{1,120}_(?:GRID|GRD)$/.test(s.gridId))fail('Identifiant de grille invalide');
      if(!['work','other'].includes(s.frame))fail('Frame source inattendue');str(s.title,'titre',300);
      if(obj(s.context,['affiliation','season','provenance'],'contexte')){
        if(s.context.affiliation!==null && (typeof s.context.affiliation!=='string'||!/^\d{6}$/.test(s.context.affiliation)))fail('Affiliation invalide');
        if(s.context.season!==null && (typeof s.context.season!=='string'||!/^20\d{2}(?:-20\d{2})?$/.test(s.context.season)))fail('Saison invalide');
        if(obj(s.context.provenance,['affiliation','season'],'provenance')){
          if(![null,'top-document-title'].includes(s.context.provenance.affiliation)||![null,'season-selector'].includes(s.context.provenance.season))fail('Provenance contexte invalide');
        }
      }
    }
    if(obj(value.target,['application','module','collection'],'destination')){
      if(value.target.application!=='Club Exemple Manager'||value.target.module!=='Gestion Club'||value.target.collection!=='Sources FFF / Footclubs UI')fail('Destination non prise en charge');
    }
    const c=value.coverage;
    if(obj(c,['scope','subset','loadedRows','exportedRows','pagination','completeDataset'],'couverture')){
      if(c.scope!=='loaded-page'||c.completeDataset!==false)fail('Une capture doit rester explicitement partielle');
      if(!['loaded','filtered'].includes(c.subset))fail('Sous-ensemble invalide');num(c.loadedRows,'lignes chargées');num(c.exportedRows,'lignes exportées');
      if(c.exportedRows>c.loadedRows)fail('Couverture incohérente');
      if(obj(c.pagination,['label','start','end','totalReported'],'pagination')){
        str(c.pagination.label,'pagination',200);for(const k of ['start','end','totalReported'])if(c.pagination[k]!==null)num(c.pagination[k],'pagination.'+k);
      }
    }
    const safety=value.safety;
    if(obj(safety,['readOnly','containsPersonalData','includesSessionData','mayContainUncommittedValues','missingRowsMeanDeletion'],'sécurité')){
      if(safety.readOnly!==true||safety.containsPersonalData!==true||safety.includesSessionData!==false||safety.mayContainUncommittedValues!==true||safety.missingRowsMeanDeletion!==false)fail('Garanties de lecture seule incorrectes');
    }
    const keys=new Set();
    if(!Array.isArray(value.columns)||value.columns.length>150)fail('Colonnes invalides');
    else value.columns.forEach((col,i)=>{
      if(obj(col,['key','label'],'colonne '+i)){
        if(typeof col.key!=='string'||!/^c[1-9]\d{0,3}$/.test(col.key)||keys.has(col.key))fail('Clé de colonne invalide ou dupliquée');
        keys.add(col.key);str(col.label,'libellé de colonne',300);
      }
    });
    if(!Array.isArray(value.rows)||value.rows.length>1000)fail('Lignes invalides ou trop nombreuses');
    else{
      if(c && c.exportedRows!==value.rows.length)fail('Nombre de lignes incohérent');
      const ordinals=new Set();
      value.rows.forEach((r,i)=>{
        if(!obj(r,['ordinal','identifiers','values','selection'],'ligne '+i))return;
        num(r.ordinal,'ordinal');if(ordinals.has(r.ordinal))fail('Ordinal dupliqué');ordinals.add(r.ordinal);
        if(obj(r.identifiers,['personNumber','personNumberSource','licenceNumber'],'identifiants')){
          id(r.identifiers.personNumber,'numéro personne');id(r.identifiers.licenceNumber,'numéro licence');
          if(![null,'visible-cell','native-link'].includes(r.identifiers.personNumberSource))fail('Provenance numéro invalide');
          if((r.identifiers.personNumber===null)!==(r.identifiers.personNumberSource===null))fail('Provenance numéro incohérente');
        }
        if(obj(r.values,[...keys],'valeurs'))Object.values(r.values).forEach(v=>str(v,'cellule'));
        if(obj(r.selection,['checkedBoxes','lockedCheckedBoxes','hasLocalChanges'],'sélection')){
          num(r.selection.checkedBoxes,'cases cochées');num(r.selection.lockedCheckedBoxes,'cases verrouillées');
          if(r.selection.lockedCheckedBoxes>r.selection.checkedBoxes)fail('Compteur de cases incohérent');
          if(typeof r.selection.hasLocalChanges!=='boolean')fail('État de saisie invalide');
        }
      });
    }
    return {ok:errors.length===0,errors};
  }
  function parse(text){
    if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BYTES)throw new Error('Fichier trop volumineux (maximum 5 Mo).');
    let snapshot;try{snapshot=JSON.parse(text);}catch(_){throw new Error('Le fichier n’est pas un JSON valide.');}
    const result=validate(snapshot);if(!result.ok)throw new Error(result.errors.slice(0,4).join(' · '));return snapshot;
  }
  // V1.22.8.1 — Présentation uniquement ; capture source conservée intacte.
  function coverageText(snapshot){
    const unit=snapshot.source.gridId==='EXT_CLB_LIC_LIST_GRID'?'licence(s)':'ligne(s)';
    const total=snapshot.coverage.pagination.totalReported;
    return `${snapshot.rows.length} ${unit} consultée(s)`+(Number.isSafeInteger(total)?` sur ${total} annoncée(s) par Footclubs`:' · total non fourni par Footclubs');
  }
  function displayColumns(snapshot){
    return snapshot.columns.filter(c=>{
      const technical=/^Suppr\b/i.test(c.label)||/^Colonne \d+$/i.test(c.label);
      return !technical||snapshot.rows.some(r=>String(r.values[c.key]??'').trim()!=='');
    }).map(c=>({...c,label:/^Suppr\b/i.test(c.label)?'Sélection (source)':c.label==='Photo'?'Statut photo':c.label==='Etat'?'État':c.label==='Carton jaune Carton rouge'?'Cartons (couleur non précisée)':c.label}));
  }
  function mount(container,snapshot){
    const result=validate(snapshot);if(!result.ok)throw new Error(result.errors.slice(0,4).join(' · '));
    if(!container||!container.ownerDocument)throw new Error('Conteneur DOM manquant');
    const doc=container.ownerDocument,host=doc.createElement('section');host.dataset.lcmFootclubsSource='1';
    const shadow=host.attachShadow({mode:'open'}),style=doc.createElement('style');style.textContent=`
:host{display:block;font:13px/1.45 system-ui,sans-serif;color:#e6edf7}*{box-sizing:border-box}.card{background:#162233;border:1px solid #34475f;border-radius:14px;padding:20px}.eyebrow{font-size:10px;letter-spacing:.1em;color:#8ac9ff;text-transform:uppercase}h2{font-size:21px;margin:9px 0}.muted{color:#a5b6cc;font-size:12px}.warning{padding:11px;background:#47351d;color:#ffcd7d;border-radius:8px;border:1px solid #806342;margin:14px 0}.scroller{overflow:auto;max-height:55vh;border:1px solid #34475f;border-radius:8px}table{border-collapse:collapse;width:100%;min-width:700px}th,td{padding:8px 10px;border-bottom:1px solid #34475f;text-align:left;overflow-wrap:anywhere}th{position:sticky;top:0;background:#203149;font-size:11px}td{font-size:12px}tr:nth-child(even){background:#19293c}.rowbar{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px}b{color:#8ac9ff}:focus-visible{outline:3px solid #ffd84a;outline-offset:3px}.muted{overflow-wrap:anywhere}@media(max-width:560px){.card{padding:12px}}
`;shadow.append(style);
    const el=(tag,text,cls)=>{const n=doc.createElement(tag);if(text!==undefined)n.textContent=String(text);if(cls)n.className=cls;return n;};
    const card=el('article',undefined,'card');card.append(el('div','Club Exemple Manager / Gestion Club / Sources FFF','eyebrow'),el('h2',snapshot.source.title));
    card.append(el('p',`Footclubs UI ${snapshot.generator.version} · capture du ${new Date(snapshot.capturedAt).toLocaleString('fr-FR')} · source déclarée, non certifiée`, 'muted'));
    const warning=el('div','Vue de consultation — capture partielle. Cette vue ne modifie pas la base. Les valeurs peuvent inclure des saisies non enregistrées dans Footclubs.','warning');card.append(warning);
    const rowbar=el('div',undefined,'rowbar');rowbar.append(el('b',coverageText(snapshot)),el('span',`${snapshot.coverage.loadedRows} ligne(s) chargée(s) sur cette page · capture partielle`));card.append(rowbar);
    const columns=displayColumns(snapshot);
    const scroll=el('div',undefined,'scroller'),table=el('table'),head=el('thead'),hr=el('tr');
    columns.forEach(c=>{const th=el('th',c.label);th.scope='col';hr.append(th);});head.append(hr);table.append(head);
    const body=el('tbody');snapshot.rows.forEach(r=>{const tr=el('tr');columns.forEach(c=>tr.append(el('td',r.values[c.key]??'—')));body.append(tr);});table.append(body);scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label','Licences — tableau défilant');scroll.append(table);card.append(scroll);
    card.append(el('p',`Origine : ${snapshot.source.origin}${snapshot.source.path} · Grille : ${snapshot.source.gridId} · Saison : ${snapshot.source.context.season||'non fournie'} · Affiliation : ${snapshot.source.context.affiliation||'non fournie'}`,'muted'));
    shadow.append(card);container.replaceChildren(host);return Object.freeze({unmount:()=>host.remove(),schema:SCHEMA});
  }
  const api=Object.freeze({schema:SCHEMA,maxBytes:MAX_BYTES,validate,parse,mount,coverageText});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.GenericClubFootclubsSource=api;
})(globalThis);


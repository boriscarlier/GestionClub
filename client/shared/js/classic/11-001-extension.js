
/* V0.08.8 — shared, closed contract. No HTML execution, network or persistence.
 * Used both before download and by the preparatory Gestion Club viewer.
 */
(function (root) {
  'use strict';
  const SCHEMA = 'footclubs-ui/source-capture/1';
  const limits = Object.freeze({bytes:1500000,blocks:160,rows:500,columns:40,text:50000,cell:4000,references:80});
  const plain = v => v!==null && typeof v==='object' && !Array.isArray(v) && [Object.prototype,null].includes(Object.getPrototypeOf(v));
  // A source is a declared origin, not a verified signature or an authentication grant.
  const originOK = v => typeof v==='string' && /^https:\/\/(?:[a-z0-9-]+\.)*fff\.fr$/.test(v);
  const pathOK = v => typeof v==='string' && v.length<=300 && /^\/[a-zA-Z0-9_./~-]*$/.test(v) && !v.includes('..') && !v.startsWith('//');
  function validate(v) {
    const errors=[];const fail=t=>{if(errors.length<20)errors.push(t);};
    const obj=(x,keys,p)=>{if(!plain(x)){fail(p+' : objet attendu');return false;}if(Object.keys(x).some(k=>!keys.includes(k))||keys.some(k=>!Object.hasOwn(x,k)))fail(p+' : propriétés inattendues ou manquantes');return true;};
    const str=(x,p,n=300)=>{if(typeof x!=='string'||x.length>n)fail(p+' : texte invalide');};
    const bool=(x,p)=>{if(typeof x!=='boolean')fail(p+' : booléen attendu');};
    const num=(x,p,max)=>{if(!Number.isSafeInteger(x)||x<0||x>max)fail(p+' : compteur invalide');};
    if(!obj(v,['schema','generator','capturedAt','source','coverage','safety','blocks','references','structure'],'capture'))return {ok:false,errors};
    if(v.schema!==SCHEMA)fail('Schéma non pris en charge');
    if(obj(v.generator,['name','version'],'générateur')){if(v.generator.name!=='Footclubs UI')fail('Générateur inattendu');str(v.generator.version,'version',24);}
    if(typeof v.capturedAt!=='string'||!/^\d{4}-\d\d-\d\dT/.test(v.capturedAt)||!Number.isFinite(Date.parse(v.capturedAt)))fail('Date de capture invalide');
    if(obj(v.source,['origin','path','kind','title','frame','selection','context'],'source')) {
      if(v.source.origin!=='https://footclubs.fff.fr')fail('Domaine de lecture non autorisé');
      if(!pathOK(v.source.path))fail('Chemin invalide ou paramétré');
      if(!['list','person','licence','html-document','assisted-html'].includes(v.source.kind))fail('Type de source inconnu');
      str(v.source.title,'titre');str(v.source.frame,'cadre',60);
      if(obj(v.source.selection,['mode','tag'],'sélection')) {
        if(!['page','block'].includes(v.source.selection.mode))fail('Mode de capture invalide');
        if(typeof v.source.selection.tag!=='string'||!(/^[A-Z0-9]{1,20}$/).test(v.source.selection.tag))fail('Balise de sélection invalide');
      }
      if(obj(v.source.context,['affiliation','season'],'contexte')){
        const c=v.source.context;
        if(c.affiliation!==null&&(typeof c.affiliation!=='string'||!/^\d{6}$/.test(c.affiliation)))fail('Affiliation invalide');
        if(c.season!==null&&(typeof c.season!=='string'||!/^20\d{2}(?:-20\d{2})?$/.test(c.season)))fail('Saison invalide');
      }
    }
    if(obj(v.coverage,['scope','completeDataset','originalFileIncluded','truncated','uncommittedValuesPossible'],'couverture')) {
      if(v.coverage.scope!=='rendered-dom'||v.coverage.completeDataset!==false||v.coverage.originalFileIncluded!==false||v.coverage.uncommittedValuesPossible!==true)fail('La capture doit rester une copie HTML partielle, non un original');
      bool(v.coverage.truncated,'troncature');
    }
    if(obj(v.safety,['readOnly','containsPersonalData','includesRawHtml','includesSessionData','missingRowsMeanDeletion'],'sécurité')) {
      const s=v.safety;
      if(s.readOnly!==true||s.containsPersonalData!==true||s.includesRawHtml!==false||s.includesSessionData!==false||s.missingRowsMeanDeletion!==false)fail('Garanties de consultation invalides');
    }
    let tables=0,rows=0,chars=0;
    if(!Array.isArray(v.blocks)||v.blocks.length>limits.blocks)fail('Blocs absents ou trop nombreux');
    else v.blocks.forEach((b,i)=>{
      if(b?.type==='text') {
        if(obj(b,['type','text'],'texte '+i)){str(b.text,'texte',limits.text);chars+=typeof b.text==='string'?b.text.length:0;}
      } else if(b?.type==='table') {
        if(!obj(b,['type','title','columns','rows'],'tableau '+i))return;
        tables++;str(b.title,'titre tableau');
        if(!Array.isArray(b.columns)||b.columns.length<1||b.columns.length>limits.columns)fail('Colonnes invalides');
        else b.columns.forEach(c=>str(c,'colonne',300));
        if(!Array.isArray(b.rows)||b.rows.length>limits.rows)fail('Lignes invalides');
        else b.rows.forEach(r=>{
          rows++;
          if(!Array.isArray(r)||r.length!==b.columns?.length){fail('Alignement des cellules invalide');return;}
          r.forEach(c=>{str(c,'cellule',limits.cell);chars+=typeof c==='string'?c.length:0;});
        });
      } else fail('Bloc non pris en charge');
    });
    if(rows>limits.rows||chars>limits.text)fail('Contenu au-delà des limites');
    if(!Array.isArray(v.references)||v.references.length>limits.references)fail('Références invalides');
    else v.references.forEach(r=>{
      if(!obj(r,['label','format','origin','path','queryOmitted','availableAs'],'référence'))return;
      str(r.label,'libellé référence');
      if(!['pdf','doc','docx','xls','xlsx','csv','image','viewer','other'].includes(r.format))fail('Format de référence invalide');
      if(!originOK(r.origin)||!pathOK(r.path))fail('Adresse de référence invalide');
      bool(r.queryOmitted,'paramètres retirés');
      if(r.availableAs!=='reference-only')fail('Un lien repéré ne constitue pas le fichier original');
    });
    if(obj(v.structure,['method','fingerprint','tableCount','rowCount','textCharacters'],'structure')) {
      if(v.structure.method!=='fnv1a-layout-v1'||typeof v.structure.fingerprint!=='string'||!(/^[a-f0-9]{8}$/).test(v.structure.fingerprint))fail('Empreinte structurelle invalide');
      num(v.structure.tableCount,'tableaux',limits.blocks);num(v.structure.rowCount,'lignes',limits.rows);num(v.structure.textCharacters,'caractères',limits.text);
      if(v.structure.tableCount!==tables||v.structure.rowCount!==rows||v.structure.textCharacters!==chars)fail('Compteurs de structure incohérents');
    }
    // Reject session markers anywhere. Validation is not a general PII detector.
    let serialized='';try{serialized=JSON.stringify(v);}catch(_){fail('Capture non sérialisable');}
    if(serialized.length>limits.bytes||new TextEncoder().encode(serialized).length>limits.bytes)fail('Capture trop volumineuse');
    if(/(?:SYMID|TIME_STAMP|USR_ORA|access_token|refresh_token|sessionid|JSESSIONID)\s*(?:=|%3[dD])|data:image\/|javascript:|Bearer\s+[\w.-]{8}/i.test(serialized))fail('Contenu technique de session interdit');
    return {ok:errors.length===0,errors};
  }
  function parse(text) {
    if(typeof text!=='string'||new TextEncoder().encode(text).length>limits.bytes)throw new Error('Fichier trop volumineux (1,5 Mo maximum).');
    let v;try{v=JSON.parse(text);}catch(_){throw new Error('Le fichier n’est pas un JSON valide.');}
    const r=validate(v);if(!r.ok)throw new Error(r.errors.slice(0,4).join(' · '));return v;
  }
  // Projection limitée à la fiche observée ; le paquet reçu reste intact.
  function projectPerson(snapshot){
    const groups={identity:[],address:[],preferences:[],other:[],contacts:[],guardians:[],licences:[]};
    const blocks=snapshot.blocks;
    for(let i=0;i<blocks.length;i++){
      const b=blocks[i];
      if(b.type==='table'){
        let columns=[...b.columns],rows=b.rows.map(r=>[...r]);
        if(b.title==='Contacts'||b.title==='Représentants légaux'){
          const k=columns.indexOf('Suppr');
          if(k>=0&&rows.every(r=>['','Non cochée'].includes(r[k]))){columns.splice(k,1);rows.forEach(r=>r.splice(k,1));}
          groups[b.title==='Contacts'?'contacts':'guardians'].push({...b,columns,rows});continue;
        }
        if(b.title==='Licences'){
          const known=['Saison','Sous-catégorie','Ligue','Club','Club','Licence enregistrée','Etat'];
          if((JSON.stringify(columns)===JSON.stringify(known)||JSON.stringify(columns)===JSON.stringify([...known,'Départ']))&&rows.length&&rows.every(r=>/^\d{6}$/.test(r[3]))){columns[3]='Affiliation du club';columns[4]='Nom du club';columns[6]='État';}
          groups.licences.push({...b,columns,rows});continue;
        }
        groups.other.push(b);continue;
      }
      const t=b.text.trim();
      if(t===snapshot.source.title||['Valider','Rafraîchir','Créer représentant légal'].includes(t)||t.startsWith('Droits de reproduction et de diffusion réservés © Fédération Française de Football'))continue;
      if(t==='Numéro personne'&&blocks[i+1]?.type==='text'&&/^\d{1,12}$/.test(blocks[i+1].text.trim())){groups.identity.push({type:'text',text:t+' : '+blocks[++i].text.trim()});continue;}
      if(/^(Monsieur |Madame |Né\(e\) le )/.test(t)){groups.identity.push(b);continue;}
      if(t==='Nationalité'&&blocks[i+1]?.type==='text'&&blocks[i+1].text.trim()==='Française'){groups.identity.push({type:'text',text:'Nationalité : Française'});i++;continue;}
      if(/^(Voie-rue |Bureau distributeur |Pays étranger ou DOM-TOM )/.test(t)){groups.address.push(b);continue;}
      if(/^(Non cochée|Cochée) (Souhaite être informé|Ne souhaite pas que ses coordonnées)/.test(t)){groups.preferences.push(b);continue;}
      groups.other.push(b);
    }
    return groups;
  }
  function mount(container,snapshot) {
    const result=validate(snapshot);if(!result.ok)throw new Error(result.errors.slice(0,4).join(' · '));
    const doc=container.ownerDocument,el=(tag,text,cls)=>{const e=doc.createElement(tag);if(text!==undefined)e.textContent=String(text);if(cls)e.className=cls;return e;};
    const host=el('section');host.dataset.neoSourceView='1';const root=host.attachShadow({mode:'open'});
    const style=el('style');style.textContent=`
.person-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.person-card{min-width:0;padding:16px;border:1px solid #34475f;border-radius:12px;background:#162233}.person-card h3{margin-top:0}.person-card:not([data-person-group="identity"]):not([data-person-group="address"]){grid-column:1/-1}.person-cards{align-items:start}summary{min-height:44px;padding:10px 0} @media(max-width:700px){.person-cards{grid-template-columns:1fr}} :host{display:block;color:var(--sc-text,#e6edf7);font:13px/1.55 system-ui,sans-serif}*{box-sizing:border-box}h2{font-size:21px;margin:9px 0}h3{font-size:13px;margin:16px 0 8px}.muted{color:var(--sc-muted,#a5b6cc);font-size:12px}.tag{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--sc-link,#8ac9ff)}.notice{padding:12px;background:var(--sc-raised,#203149);border:1px solid var(--sc-line,#34475f);border-radius:9px;margin:12px 0}.text{white-space:pre-wrap;overflow-wrap:anywhere;margin:7px 0}.scroll{overflow:auto;max-height:400px;border:1px solid var(--sc-line,#34475f);border-radius:9px}table{border-collapse:collapse;width:100%;min-width:420px}td,th{padding:7px 9px;border-bottom:1px solid var(--sc-line,#34475f);text-align:left;overflow-wrap:anywhere;font-size:12px;white-space:pre-wrap}th{background:var(--sc-raised,#203149);position:sticky;top:0;font-size:11px}.ref{padding:10px;border-bottom:1px solid var(--sc-line,#34475f)}code{font:11px/1.5 monospace;overflow-wrap:anywhere}details{margin-top:16px}summary{cursor:pointer;font-weight:700}:focus-visible{outline:3px solid #ffd84a;outline-offset:3px}.muted{overflow-wrap:anywhere}
`;root.append(style);
    root.append(el('div','Sources FFF / Copie de consultation','tag'),el('h2',snapshot.source.title||'Source HTML sans titre'));
    root.append(el('p',`Capture du ${new Date(snapshot.capturedAt).toLocaleString('fr-FR')} · origine déclarée, non certifiée`,'muted'));
    root.append(el('p','Copie partielle du contenu HTML rendu. Aucun fichier original récupéré, aucune fusion avec la base Gestion Club. Des valeurs non enregistrées peuvent être présentes.','notice'));
    if(snapshot.coverage.truncated)root.append(el('p','Limite atteinte : une partie du contenu n’a pas été capturée.','notice'));
    function renderBlocks(blocks,destination,omitTableTitle=false){
    for(const b of blocks) {
      if(b.type==='text'){if(b.text.trim())destination.append(el('p',b.text,'text'));continue;}
      if(!b.rows.length)continue;
      const indexes=b.columns.map((_,i)=>i).filter(i=>b.rows.some(r=>r[i].trim()!==''));
      if(!indexes.length)continue;
      if(!omitTableTitle)destination.append(el('h3',b.title||'Tableau'));const scroll=el('div',undefined,'scroll'),table=el('table'),head=el('thead'),tr=el('tr');
      indexes.forEach(i=>{const th=el('th',b.columns[i]);th.scope='col';tr.append(th);});head.append(tr);table.append(head);
      const body=el('tbody');b.rows.forEach(r=>{const row=el('tr');indexes.forEach(i=>row.append(el('td',r[i])));body.append(row);});table.append(body);scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label',(b.title||'Tableau')+' — défilement');scroll.append(table);destination.append(scroll);
    }
    }
    if(snapshot.source.kind==='person'&&snapshot.source.path==='/extrafoot/EX_PERSONNE.Ident'){
      const groups=projectPerson(snapshot);
      const summary=el('section');summary.dataset.personSummary='1';
      const labels={identity:'Identité',address:'Adresse',preferences:'Préférences FFF — états capturés',contacts:'Contacts',guardians:'Représentants légaux',licences:'Historique des licences',other:'Autres informations — contexte à vérifier'};
      const cards=el('div',undefined,'person-cards');summary.append(cards);
      for(const key of Object.keys(labels)){
        if(!groups[key].length)continue;
        const card=el('section',undefined,'person-card');card.dataset.personGroup=key;card.append(el('h3',labels[key]));
        renderBlocks(groups[key],card,['contacts','guardians','licences'].includes(key)&&groups[key].length===1);cards.append(card);
      }
      summary.append(el('p','Vue regroupée à partir des libellés observés. Aucun rapprochement avec la base du club. Les valeurs sans contexte certain restent dans « Autres informations ».','muted'));
      if(!groups.guardians.some(b=>b.rows.length)&&snapshot.blocks.some(b=>b.type==='text'&&b.text.trim()==='Créer représentant légal'))summary.append(el('p','La capture contient une commande de création de représentant légal ; elle ne permet pas de conclure à la présence ou à l’absence de représentants.','notice'));
      root.append(summary);
      const raw=el('details');raw.dataset.personRaw='1';raw.append(el('summary','Voir la capture intégrale ('+snapshot.blocks.length+' blocs)'));
      renderBlocks(snapshot.blocks,raw);root.append(raw);
    }else renderBlocks(snapshot.blocks,root);
    if(!snapshot.blocks.length)root.append(el('p','Aucun texte ou tableau capturé. Les références ci-dessous ne sont pas les fichiers originaux.','notice'));
    if(snapshot.references.length) {
      const d=el('details');d.append(el('summary',`${snapshot.references.length} référence(s) de document — fichiers non récupérés`));
      snapshot.references.forEach(r=>{const p=el('div',undefined,'ref');p.append(el('strong',r.label||'Document'),el('p',`${r.format.toUpperCase()} · référence seulement`,'muted'),el('code',r.origin+r.path));if(r.queryOmitted)p.append(el('p','Paramètres retirés : cette référence ne reconstitue pas un lien de téléchargement.','muted'));d.append(p);});root.append(d);
    }
    let meta=`Origine : ${snapshot.source.origin}${snapshot.source.path} · sélection : ${snapshot.source.selection.mode==='block'?'bloc choisi':'page'} · empreinte de structure : ${snapshot.structure.fingerprint}`;
    if(snapshot.source.context.season)meta+=` · saison ${snapshot.source.context.season}`;
    if(snapshot.source.context.affiliation)meta+=` · club ${snapshot.source.context.affiliation}`;
    root.append(el('p',meta,'muted'));container.replaceChildren(host);return Object.freeze({destroy:()=>host.remove()});
  }
  const api=Object.freeze({schema:SCHEMA,limits,validate,parse,mount,originOK,pathOK,projectPerson});
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.NeoFootclubsSourceContract=api;
})(globalThis);


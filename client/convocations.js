'use strict';
window.Convocations=(()=>{
 const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 function mount(pdf,root,valid){
  const section=node('section');section.className='convocation';const heading=node('h3','Préparer la convocation'),open=node('button','Ouvrir la fiche de convocation'),content=node('div');open.type='button';section.append(heading,open,content);root.append(section);
  let generation=0;
  async function load(){const seq=++generation;open.disabled=true;content.replaceChildren(node('p','Chargement de la fiche…'));
   try{const out=await api('/api/watch/convocation?id='+encodeURIComponent(pdf.id));if(!valid()||seq!==generation)return;render(out);}catch(e){if(valid()&&seq===generation)content.replaceChildren(node('p',e.message));}finally{if(valid()&&seq===generation)open.disabled=false;}
  }
  open.addEventListener('click',load);
  function render(out){
   const saved=out.saved,src=out.source,readonly=user.role==='reader';content.replaceChildren();
   const status=node('p',saved?(out.stale?'Analyse modifiée : fiche à revoir.':saved.verified?'Fiche vérifiée.':'Brouillon enregistré.'):'Nouvelle fiche — pas encore enregistrée.');status.setAttribute('role','status');content.append(status);
   content.append(node('p','Horaires de La Réunion. Cette fiche reste sur le serveur ; aucun message ni événement de calendrier n’est envoyé.'));
   if(out.stale&&saved){const previous=node('details');previous.append(node('summary','Joueurs de la fiche précédente'));for(const p of saved.players)previous.append(node('p',p.surname+' '+p.givenNames+' · page '+p.page));content.append(previous);}
   const form=node('form'),grid=node('div');grid.className='convocation-grid';const fields={};
   for(const [key,title,type] of [['title','Titre','text'],['date','Date de la convocation','date'],['arrival','Rendez-vous','time'],['start','Début','time'],['end','Fin','time'],['place','Lieu et adresse','text'],['notes','Notes','textarea']]){
    const label=node('label',title),input=node(type==='textarea'?'textarea':'input');if(type!=='textarea')input.type=type;input.value=saved?.[key]||((key==='title')?pdf.name.replace(/\.pdf$/i,''):'');input.disabled=readonly;input.maxLength=key==='notes'?2000:key==='place'?400:200;label.append(input);grid.append(label);fields[key]=input;
   }
   if(src.dates.length){const d=node('details');d.append(node('summary','Dates repérées dans le PDF — choisir après vérification'));for(const date of src.dates){const p=node('p',date.date+' · page '+date.page+' — '+date.context);if(!readonly){const b=node('button','Utiliser cette date');b.type='button';b.addEventListener('click',()=>{fields.date.value=date.date;changed();});p.append(b);}d.append(p);}content.append(d);}
   if(!saved&&!readonly){const suggestions=[];
    for(const p of pdf.report.pages){const text=p.text||'';for(const [key,pattern] of [['arrival',/rendez-vous\s+à\s+(\d{1,2})h(\d{2})/ig],['start',/début\s+de\s+la\s+détection\s+à\s+(\d{1,2})h(\d{2})/ig],['end',/fin\s+à\s+(\d{1,2})h(\d{2})/ig]])for(const m of text.matchAll(pattern))suggestions.push({key,value:m[1].padStart(2,'0')+':'+m[2],page:p.page});}
    for(const key of ['arrival','start','end']){const candidates=suggestions.filter(x=>x.key===key);if(candidates.length===1){fields[key].value=candidates[0].value;content.append(node('p','Horaire proposé depuis la page '+candidates[0].page+' : '+candidates[0].value+' — à vérifier.'));}}
   }
   form.append(grid);const players=node('fieldset');players.append(node('legend','Joueurs relevés dans le PDF'));const boxes=[];
   const selected=new Set(saved&&!out.stale?saved.players.map(p=>p.key):[]);
   if(!src.players.length)players.append(node('p','Aucun joueur établi dans cette analyse. Réanalysez le PDF ou vérifiez sa structure.'));
   for(const p of src.players){const label=node('label'),check=node('input');check.type='checkbox';check.disabled=readonly;check.checked=saved?selected.has(p.key):true;boxes.push({check,key:p.key});label.append(check,document.createTextNode(p.surname+' '+p.givenNames+' · '+p.club+' · page '+p.page));players.append(label);}form.append(players);
   const confirmation=node('label'),check=node('input');check.type='checkbox';check.disabled=readonly;check.checked=!!saved?.verified&&!out.stale;confirmation.append(check,document.createTextNode('J’ai vérifié les joueurs, la date, les horaires et le lieu dans le PDF original.'));form.append(confirmation);
   let dirty=false;function changed(){dirty=true;check.checked=false;status.textContent='Modifications non enregistrées — vérification à refaire.';}
   for(const input of Object.values(fields))input.addEventListener('input',changed);for(const b of boxes)b.check.addEventListener('change',changed);check.addEventListener('change',()=>{dirty=true;status.textContent='État de vérification non enregistré.';});
   const save=node('button','Enregistrer la fiche');save.type='submit';save.hidden=readonly;form.append(save);
   form.addEventListener('submit',async ev=>{ev.preventDefault();if(readonly)return;save.disabled=true;open.disabled=true;const body={document:pdf.id,fingerprint:src.fingerprint,version:saved?.version||0,verified:check.checked,playerKeys:boxes.filter(b=>b.check.checked).map(b=>b.key)};for(const [key,input] of Object.entries(fields))body[key]=input.value;
    for(const control of content.querySelectorAll('input,textarea,button'))control.disabled=true;
    try{await api('/api/watch/convocation','PUT',body);if(!valid())return;dirty=false;await load();}catch(e){if(valid())status.textContent=e.message;}finally{if(valid()){open.disabled=false;for(const control of content.querySelectorAll('input,textarea,button'))control.disabled=readonly;}}
   });content.append(form);
   if(saved){const exportButton=node('button','Télécharger la fiche enregistrée (JSON)');exportButton.type='button';exportButton.addEventListener('click',async()=>{if(dirty){status.textContent='Enregistrez vos modifications avant de télécharger la fiche.';return;}let latest;try{latest=await api('/api/watch/convocation?id='+encodeURIComponent(pdf.id));}catch(e){if(valid())status.textContent=e.message;return;}if(!valid())return;const data={format:'FC_LA_COUR_CONVOCATION',schemaVersion:1,...latest.saved,stale:latest.stale};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=node('a');a.href=url;a.download='FC_LA_COUR_convocation_'+pdf.id.slice(0,12)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});content.append(exportButton);content.append(node('p','Enregistrée par '+saved.actor+' · révision '+saved.version));}
  }
 }
 return {mount};
})();

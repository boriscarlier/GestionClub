'use strict';
window.PDFWatch=(()=>{
 const $=id=>document.getElementById(id),labels={unread:'À lire',read:'Lu',action:'À traiter',archived:'Archivé'};
 let epoch=0,selection=0,draft=null,busy=false,readSeq=0;
 const node=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
 const valid=e=>e===epoch&&!!user;
 const msg=text=>{$('pdfMessage').textContent=text;};
 function clearDraft(){selection++;draft=null;$('pdfFile').value='';$('pdfSource').value='';$('pdfConfirm').checked=false;$('pdfConfirm').disabled=true;$('pdfSave').disabled=true;$('pdfPreview').replaceChildren();}
 function hide(){epoch++;readSeq++;busy=false;clearDraft();$('pdfFile').disabled=false;$('pdfList').replaceChildren();$('pdfDetail').replaceChildren();msg('');}
 function show(){hide();$('pdfImport').hidden=user.role==='reader';refresh().catch(e=>msg(e.message));}
 const button=(title,fn)=>{const b=node('button',title);b.type='button';b.addEventListener('click',fn);return b;};
 function render(report,target){
  target.replaceChildren(node('p',report.pageCount+' pages analysées. '+report.notice));
  const players=report.pages.flatMap(p=>(p.players||[]).map(player=>({...player,page:p.page})));
  if(players.length){
   target.append(node('h3',players.length+' joueur(s) relevé(s) pour CLUB EXEMPLE'));
   target.append(node('p','Lignes du tableau du PDF, à vérifier sur la page originale. Aucun rapprochement automatique avec les licenciés.'));
   const table=node('table'),head=node('thead'),hr=node('tr'),body=node('tbody');
   for(const title of ['Nom','Prénoms','Club dans le PDF','Page']){const th=node('th',title);th.scope='col';hr.append(th);}head.append(hr);
   for(const p of players){const row=node('tr');for(const value of [p.surname,p.givenNames,p.club,String(p.page)])row.append(node('td',value));body.append(row);}table.append(head,body);const wrap=node('div');wrap.className='pdf-player-table';wrap.append(table);target.append(wrap);
  }else if(!report.analysisVersion)target.append(node('p','Ancienne analyse : réanalysez ce document pour rechercher les lignes de joueurs.'));
  for(const warning of report.warnings){const p=node('p',warning);p.className='watch-warning';target.append(p);}
  for(const page of report.pages){const d=node('details'),s=node('summary','Page '+page.page+' · '+(page.terms.join(' / ')||'Aucun thème repéré')+' · '+page.dates.length+' date(s) repérée(s)'+((page.players||[]).length?' · '+page.players.length+' joueur(s)':''));d.append(s);
   if(page.state!=='text')d.append(node('p',({ 'no-text':'Pas de texte extractible : vérifier visuellement le PDF.',error:'Page illisible pour le moteur.',truncated:'Extraction tronquée à 15 000 caractères.'})[page.state]));
   for(const date of page.dates){const p=node('p',date.date+' — contexte : '+date.context);p.className='watch-warning';d.append(p);}
   const t=node('pre',page.text||'Aucun texte disponible.');t.className='pdf-text';d.append(t);target.append(d);
  }
 }
 async function refresh(){const e=epoch;const out=await api('/api/watch/pdfs');if(!valid(e))return;$('pdfList').replaceChildren();
  if(!out.documents.length)$('pdfList').append(node('p','Aucun document PDF enregistré.'));
  for(const row of out.documents){const p=node('p');p.append(button(row.name+' · '+labels[row.status],()=>open(row.id)));$('pdfList').append(p);}
 }
 async function open(id){const e=epoch,seq=++readSeq;try{const out=await api('/api/watch/pdf?id='+encodeURIComponent(id));if(!valid(e)||seq!==readSeq)return;
  const root=$('pdfDetail');root.replaceChildren(node('h3',out.name),node('p','Source déclarée : '+out.source+' · enregistré par '+out.actor));
  root.append(button('Télécharger le PDF original',async()=>{try{const result=await api('/api/watch/pdf-file?id='+encodeURIComponent(id));if(!valid(e))return;const bytes=Uint8Array.from(atob(result.file),c=>c.charCodeAt(0));const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));const a=node('a');a.href=url;a.download=result.name.endsWith('.pdf')?result.name:result.name+'.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(err){if(valid(e))msg(err.message);}}));
  if(user.role!=='reader'){
   const re=button('Réanalyser le PDF enregistré',async()=>{re.disabled=true;msg('Nouvelle analyse du PDF original…');try{await api('/api/watch/pdf-reanalyze','POST',{id,version:out.version});if(!valid(e))return;await open(id);msg('Analyse actualisée. Le PDF original et son suivi sont conservés.');}catch(err){if(valid(e))msg(err.message);}finally{re.disabled=false;}});root.append(re);
  }
  if(user.role!=='reader'){const f=node('form'),l=node('label','Suivi du document'),select=node('select');for(const [v,t] of Object.entries(labels)){const o=node('option',t);o.value=v;select.append(o);}select.value=out.status;l.append(select);const b=node('button','Enregistrer le suivi');f.append(l,b);f.addEventListener('submit',async ev=>{ev.preventDefault();b.disabled=true;try{await api('/api/watch/pdf-status','PUT',{id,status:select.value,version:out.version});if(!valid(e))return;await open(id);await refresh();}catch(err){if(valid(e))msg(err.message);}finally{b.disabled=false;}});root.append(f);}
  window.Convocations.mount(out,root,()=>valid(e)&&seq===readSeq);
  const report=node('div');render(out.report,report);root.append(report);
  if(out.analyses?.length){const d=node('details');d.append(node('summary','Historique des réanalyses'));for(const a of out.analyses)d.append(node('p',new Date(a.created*1000).toLocaleString('fr-FR',{timeZone:'Etc/UTC'})+' · '+a.actor+' · analyse '+a.analysis_version+' · '+a.players+' joueur(s) relevé(s)'));root.append(d);}
  if(out.actions.length){const d=node('details');d.append(node('summary','Historique du suivi'));for(const a of out.actions)d.append(node('p',new Date(a.created*1000).toLocaleString('fr-FR',{timeZone:'Etc/UTC'})+' · '+a.actor+' · '+labels[a.old_status]+' → '+labels[a.new_status]));root.append(d);}
 }catch(err){if(valid(e))msg(err.message);}}
 $('pdfFile').addEventListener('change',async ev=>{const f=ev.target.files[0],source=$('pdfSource').value;clearDraft();$('pdfSource').value=source;if(!f)return;const e=epoch,seq=selection;
  msg('Analyse locale du PDF…');try{if(f.size>5*1024*1024)throw Error('Maximum 5 Mo.');const bytes=new Uint8Array(await f.arrayBuffer());if(!valid(e)||seq!==selection)return;
   let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));const payload={name:f.name,source:source||'Source non précisée',file:btoa(binary)};
   const out=await api('/api/watch/pdf-preview','POST',payload);if(!valid(e)||seq!==selection)return;draft={...payload,digest:out.id};render(out.report,$('pdfPreview'));$('pdfConfirm').disabled=false;msg('Aperçu prêt. Vérifiez les pages avant de conserver le document.');
  }catch(err){if(valid(e)&&seq===selection)msg(err.name==='AbortError'?'Analyse trop longue ; aucun enregistrement demandé.':err.message);}
 });
 $('pdfConfirm').addEventListener('change',()=>{$('pdfSave').disabled=busy||!draft||!$('pdfConfirm').checked;});
 $('pdfSave').addEventListener('click',async()=>{if(busy||!draft||!$('pdfConfirm').checked)return;busy=true;$('pdfSave').disabled=true;$('pdfFile').disabled=true;const e=epoch;
  try{const out=await api('/api/watch/pdf-save','POST',{...draft,source:$('pdfSource').value||'Source non précisée',confirmed:true});if(!valid(e))return;clearDraft();msg(out.duplicate?'Ce PDF est déjà enregistré : aucun doublon créé.':'Document et résultats enregistrés.');await refresh();await open(out.id);}catch(err){if(valid(e))msg(err.name==='AbortError'?'Délai dépassé : actualisez les documents avant de réessayer.':err.message);}finally{if(valid(e)){busy=false;$('pdfFile').disabled=false;$('pdfSave').disabled=!draft||!$('pdfConfirm').checked;}}
 });
 $('pdfRefresh').addEventListener('click',()=>refresh().catch(e=>msg(e.message)));window.addEventListener('pagehide',hide);
 return {show,hide};
})();

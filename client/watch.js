'use strict';
// Rendering uses text nodes only: source pages never become executable application HTML.
window.FCLCWatch=(()=>{
 const $=id=>document.getElementById(id), states={unread:'À lire',read:'Lu',action:'À traiter',archived:'Archivé'};
 let manualDraft=null,manualEpoch=0;
 let generation=0,request=0,timer=null,active=false,offset=0,working=false;
 const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const date=t=>t?new Date(t*1000).toLocaleString('fr-FR',{timeZone:'Indian/Reunion'}):'Jamais';
 const link=(title,url)=>{const a=node('a',title);const u=new URL(url);if(u.protocol==='https:'&&['liguefoot-reunion.fff.fr','saintjoseph.re','www.saintjoseph.re'].includes(u.hostname)){a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';}return a;};
 const valid=g=>g===generation&&!!user;
 const note=t=>{$('watchMessage').textContent=t;};
 const fail=e=>note(e.name==='AbortError'?'Délai dépassé. Actualisez la veille pour vérifier le résultat.':e.message);
 function stop(){clearTimeout(timer);timer=null;}
 function hide(){resetManual();generation++;request++;stop();active=false;working=false;for(const id of ['watchSources','watchItems','watchRuns','watchCounts'])$(id).replaceChildren();note('');$('watchPanel').hidden=true;$('snapshotPanel').hidden=false;}
 function select(view){active=view==='watch';$('watchPanel').hidden=!active;$('snapshotPanel').hidden=active;$('tabWatch').setAttribute('aria-pressed',String(active));$('tabSnapshots').setAttribute('aria-pressed',String(!active));stop();if(active&&user)refresh().catch(fail);}
 function show(){resetManual();$('manualImport').hidden=user.role==='reader';generation++;select(location.hash==='#veille'?'watch':'snapshots');}
 function btn(label,handler,secondary=true){const b=node('button',label,secondary?'secondary':'');b.type='button';b.addEventListener('click',handler);return b;}
 async function mutate(path,method,data){if(working)return;working=true;const g=generation;try{await api(path,method,data);if(!valid(g))return;note('Opération enregistrée.');await refresh();}catch(e){if(valid(g))fail(e);}finally{if(valid(g))working=false;}}
 function sourceCard(s,collecting){
  const card=node('article',undefined,'watch-card');card.append(node('h3',s.name),node('p',s.description,'muted'),link('Ouvrir le site officiel ↗',s.url));
  card.append(node('p',s.count+' informations conservées · Dernière collecte réseau exploitable : '+date(s.last_success)));
  if(s.latest){const labels={running:'En cours',done:'Terminée — couverture partielle du site',partial:'Partiellement réussie',failed:'Échec',interrupted:'Interrompue'};card.append(node('p',(s.latest.summary.mode==='manual-html'?'Dernier import manuel : ':'Dernier essai : ')+labels[s.latest.status]+' · '+date(s.latest.started)));for(const error of s.latest.summary.errors||[])card.append(node('p',error,'watch-warning'));}
  const b=btn('Collecter maintenant',async()=>{if(working)return;working=true;const g=generation;b.disabled=true;try{await api('/api/watch/collect','POST',{source:s.id});if(valid(g)){note('Collecte lancée. Son résultat apparaîtra ici.');await refresh();}}catch(e){if(valid(g)){fail(e);b.disabled=false;}}finally{if(valid(g))working=false;}},false);
  b.disabled=collecting||user.role==='reader';card.append(b);
  card.append(node('p',s.enabled?'Collecte prévue : '+date(s.next_run)+' · tous les '+s.interval_days+' jours.':'Collecte manuelle uniquement.','muted'));
  if(user.role==='admin'){
   const details=node('details'),summary=node('summary','Régler la fréquence');details.append(summary);
   const f=node('form'),enabled=node('input');enabled.type='checkbox';enabled.checked=!!s.enabled;
   const label=node('label',undefined,'inline-label');label.append(enabled,document.createTextNode(' Collecte automatique lorsque le serveur fonctionne'));
   const days=node('input');days.type='number';days.min='1';days.max='30';days.required=true;days.value=s.interval_days;
   const dl=node('label','Intervalle en jours (1 à 30)');dl.append(days);const save=node('button','Enregistrer la fréquence');save.type='submit';
   f.append(label,dl,save);f.addEventListener('submit',async e=>{e.preventDefault();save.disabled=true;await mutate('/api/watch/settings','PUT',{source:s.id,enabled:enabled.checked,days:Number(days.value),version:s.version});save.disabled=false;});details.append(f);card.append(details);
  }return card;
 }
 function itemCard(item){
  const card=node('article',undefined,'watch-card watch-entry');const h=node('h3');h.append(link(item.title,item.url));card.append(h);
  card.append(node('p',(item.source==='lrf'?'Ligue':'Mairie')+' · '+states[item.status]+(item.is_document?' · Lien PDF, contenu non lu':''),'badge'));
  if(item.topics.length)card.append(node('p',item.topics.join(' · '),'topics'));
  if(item.excerpt)card.append(node('p',item.excerpt));
  if(item.observation_mode==='manual-html')card.append(node('p','Capture HTML manuelle · provenance déclarée, non certifiée · date de capture inconnue.','watch-warning'));
  card.append(node('p','Première observation dans la veille : '+date(item.first_seen)+' · Dernier enregistrement dans la veille : '+date(item.last_seen),'muted'));
  card.append(node('p',item.published?'Date annoncée par le flux : '+item.published:'Date de publication non fournie.','muted'));
  card.append(link('Page ou flux où ce lien a été repéré ↗',item.origin_page));
  if(user.role!=='reader'){
   const f=node('form',undefined,'status-form'),label=node('label','Suivi de cette information'),selectEl=node('select');
   for(const [value,title] of Object.entries(states)){const o=node('option',title);o.value=value;selectEl.append(o);}selectEl.value=item.status;label.append(selectEl);
   const save=node('button','Enregistrer le suivi');save.type='submit';f.append(label,save);f.addEventListener('submit',async e=>{e.preventDefault();save.disabled=true;await mutate('/api/watch/status','PUT',{id:item.id,status:selectEl.value,version:item.version});save.disabled=false;});card.append(f);
  }
  const d=node('details'),summary=node('summary','Historique de cette information'),content=node('div');d.append(summary,content);let loaded=false;
  d.addEventListener('toggle',async()=>{if(!d.open||loaded)return;loaded=true;const g=generation;content.textContent='Chargement…';try{const out=await api('/api/watch/item?id='+encodeURIComponent(item.id));if(!valid(g))return;content.replaceChildren(node('p','Au plus 10 versions de contenu et 30 changements de suivi affichés.','muted'));for(const v of out.versions){content.append(node('p',date(v.observed)+' — '+v.title));if(v.excerpt)content.append(node('p',v.excerpt,'muted'));}for(const a of out.actions)content.append(node('p',date(a.created)+' · '+a.actor+' · '+states[a.old_status]+' → '+states[a.new_status]));}catch(e){if(valid(g)){content.textContent=e.message;loaded=false;}}});card.append(d);return card;
 }
 function renderRuns(runs){
  $('watchRuns').replaceChildren();if(!runs.length){$('watchRuns').append(node('p','Aucune collecte lancée.'));return;}
  for(const r of runs){const d=node('details'),summary=node('summary',(r.source==='lrf'?'Ligue':'Mairie')+' · '+date(r.started)+' · '+({done:'terminée',partial:'partielle',failed:'échec',running:'en cours',interrupted:'interrompue'})[r.status]);d.append(summary,node('p','Lancée par : '+r.actor));
   if(r.summary.new!==undefined)d.append(node('p',r.summary.new+' nouveaux liens pour cette veille · '+r.summary.updated+' changements de contenu · '+r.summary.unchanged+' inchangés.'));
   for(const c of r.summary.coverage||[]){const p=node('p',c.mode+' · '+c.observed+' liens détectés · ');p.append(link('Voir la page',c.page));d.append(p);}
   for(const err of r.summary.errors||[])d.append(node('p',err,'watch-warning'));$('watchRuns').append(d);
  }
 }
 async function refresh(){
  if(!user||!active)return;stop();const g=generation,seq=++request;
  const params=new URLSearchParams({source:$('watchSource').value,status:$('watchStatus').value,topic:$('watchTopic').value,q:$('watchQuery').value,offset:String(offset)});
  const [overview,list,history]=await Promise.all([api('/api/watch'),api('/api/watch/items?'+params),api('/api/watch/history')]);
  if(!valid(g)||seq!==request||!active)return;
  const running=overview.sources.some(s=>s.latest?.status==='running');
  $('watchCounts').replaceChildren();for(const [key,title] of Object.entries(states))$('watchCounts').append(node('span',overview.counts[key]+' '+title.toLowerCase(),'count'));
  $('watchSources').replaceChildren(...overview.sources.map(s=>sourceCard(s,running)));
  $('watchItems').replaceChildren(...list.items.map(itemCard));if(!list.items.length)$('watchItems').append(node('p',list.total?'Cette page est vide. Revenez à la page précédente.':'Aucune information pour ces filtres. Lancez une collecte si la veille est encore vide.'));
  $('watchPagination').textContent=list.total?(list.offset+1)+'–'+Math.min(list.offset+list.limit,list.total)+' sur '+list.total:'0 résultat';$('watchPrev').disabled=offset===0;$('watchNext').disabled=offset+list.limit>=list.total;
  renderRuns(history.runs);if(running)timer=setTimeout(()=>refresh().catch(fail),2500);
 }
 function resetManual(){manualEpoch++;manualDraft=null;$('manualFile').disabled=false;$('manualPreview').replaceChildren();$('manualMessage').textContent='';$('manualConfirm').checked=false;$('manualConfirm').disabled=true;$('manualApply').disabled=true;$('manualFile').value='';}
 $('manualFile').addEventListener('change',async e=>{
  const file=e.target.files[0];resetManual();if(!file)return;const seq=manualEpoch,g=generation;
  try{if(file.size>2*1024*1024)throw Error('Maximum 2 Mo.');const html=await file.text();if(!valid(g)||seq!==manualEpoch)return;
   const preview=await api('/api/watch/manual-preview','POST',{html});if(!valid(g)||seq!==manualEpoch)return;
   manualDraft={html,digest:preview.digest};$('manualMessage').textContent=preview.count+' liens uniques à examiner. '+preview.notice;
   const list=node('ul');for(const item of preview.items){const li=node('li');li.append(link(item.title,item.url));list.append(li);}$('manualPreview').append(list);$('manualConfirm').disabled=false;
  }catch(e){if(valid(g)&&seq===manualEpoch)$('manualMessage').textContent=e.message;}
 });
 $('manualConfirm').addEventListener('change',()=>{$('manualApply').disabled=!manualDraft||!$('manualConfirm').checked||working;});
 $('manualApply').addEventListener('click',async()=>{
  if(!manualDraft||!$('manualConfirm').checked||working)return;working=true;const g=generation,seq=manualEpoch;
  $('manualApply').disabled=true;$('manualFile').disabled=true;
  try{const result=await api('/api/watch/manual-import','POST',{...manualDraft,confirmed:true});if(!valid(g)||seq!==manualEpoch)return;
   resetManual();note('Import manuel enregistré : '+result.new+' nouveaux liens, '+result.updated+' modifiés, '+result.unchanged+' inchangés.');await refresh();
  }catch(e){if(valid(g)&&seq===manualEpoch){$('manualMessage').textContent=e.name==='AbortError'?'Délai dépassé. Vérifiez l’historique avant de réessayer.':e.message;}}
  finally{if(valid(g)){working=false;$('manualFile').disabled=false;$('manualApply').disabled=!manualDraft||!$('manualConfirm').checked;}}
 });
 $('tabWatch').addEventListener('click',()=>{location.hash='veille';select('watch');});$('tabSnapshots').addEventListener('click',()=>{location.hash='sauvegardes';select('snapshots');});
 $('watchRefresh').addEventListener('click',()=>refresh().then(()=>note('Veille actualisée.')).catch(fail));
 $('watchFilters').addEventListener('submit',e=>{e.preventDefault();offset=0;refresh().catch(fail);});
 for(const id of ['watchSource','watchStatus','watchTopic'])$(id).addEventListener('change',()=>{offset=0;refresh().catch(fail);});
 $('watchPrev').addEventListener('click',()=>{offset=Math.max(0,offset-50);refresh().catch(fail);});$('watchNext').addEventListener('click',()=>{offset+=50;refresh().catch(fail);});
 $('watchExport').addEventListener('click',async()=>{const g=generation;try{const out=await api('/api/watch/export');if(!valid(g))return;const url=URL.createObjectURL(new Blob([JSON.stringify(out,null,2)],{type:'application/json'})),a=node('a');a.href=url;a.download='FC_LA_COUR_veille_'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);note('Export de veille demandé. Il est distinct de la sauvegarde complète du club.');}catch(e){if(valid(g))fail(e);}});
 window.addEventListener('pagehide',hide);
 return {show,hide};
})();

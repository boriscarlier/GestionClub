'use strict';
const E=id=>document.getElementById(id);
let user=null,draft=null,epoch=0,busy=false;
function message(t){E('message').textContent=t;}
function clear(){epoch++;draft=null;E('preview').replaceChildren();E('confirm').checked=false;E('confirm').disabled=true;E('publish').disabled=true;E('file').value='';}
function hide(){window.FCLCWatch?.hide();window.PDFWatch?.hide();user=null;clear();E('workspace').hidden=true;E('login').hidden=false;E('history').replaceChildren();E('status').textContent='';E('identity').textContent='';}
async function api(path,method='GET',data){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
 try{const r=await fetch(path,{method,credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json',...(user?{'X-CSRF-Token':user.csrf}:{})},body:data===undefined?undefined:JSON.stringify(data),signal:controller.signal});const body=await r.json();if(!r.ok){if(r.status===401)hide();throw Error(body.error||'Opération refusée.');}return body;}finally{clearTimeout(timer);}
}
function failure(e){message(e.name==='AbortError'?'Délai dépassé. Actualisez le statut avant de réessayer : le dépôt peut avoir été enregistré.':e.message);}
async function refresh(){
 clear();const token=epoch;
 const [status,history]=await Promise.all([api('/api/status'),api('/api/history')]);if(token!==epoch||!user)return;
 E('status').textContent=status.revision?'Révision '+status.revision+' · club '+status.club+' · '+status.counts.members+' licenciés · '+status.counts.teams+' équipes · '+status.counts.matches+' matchs.':'Aucune sauvegarde déposée.';E('download').disabled=!status.revision;
 E('history').replaceChildren();for(const row of history.revisions){const p=document.createElement('p');p.textContent='Révision '+row.id+' · '+new Date(row.created*1000).toLocaleString('fr-FR')+' · '+row.actor+' ';const b=document.createElement('button');b.textContent='Télécharger';b.addEventListener('click',()=>download(row.id));p.append(b);E('history').append(p);}
}
async function show(){E('login').hidden=true;E('workspace').hidden=false;E('writer').hidden=user.role==='reader';E('identity').textContent=user.user+' · '+({admin:'Administration',editor:'Dépôt et lecture',reader:'Lecture seule'})[user.role];await refresh();if(user){window.FCLCWatch?.show();window.PDFWatch?.show();}}
async function download(revision){const token=epoch;try{const result=await api('/api/snapshot'+(revision?'?revision='+revision:''));if(token!==epoch||!user)return;const blob=new Blob([JSON.stringify(result.backup,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='FC_LA_COUR_serveur_revision_'+result.revision+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message('Téléchargement demandé pour la révision '+result.revision+'.');}catch(e){failure(e);}}
E('login').addEventListener('submit',async e=>{e.preventDefault();if(busy)return;busy=true;E('loginButton').disabled=true;try{clear();user=await api('/api/login','POST',{name:E('name').value,password:E('password').value});E('password').value='';await show();message('Connexion établie.');}catch(e){failure(e);}finally{busy=false;E('loginButton').disabled=false;}});
E('logout').addEventListener('click',async()=>{clear();try{await api('/api/logout','POST',{});hide();message('Session fermée.');}catch(e){hide();failure(e);}});
E('refresh').addEventListener('click',()=>refresh().then(()=>message('Statut actualisé.')).catch(failure));
E('download').addEventListener('click',()=>download());
E('file').addEventListener('change',async e=>{
 const file=e.target.files[0];clear();if(!file)return;const token=epoch,owner=user?.user;
 try{if(!user||user.role==='reader')throw Error('Compte autorisé au dépôt requis.');if(file.size>29*1024*1024)throw Error('Fichier trop volumineux (maximum 29 Mo pour le dépôt).');const backup=JSON.parse(await file.text());if(backup.format!=='FC_LA_COUR_FULL_BACKUP'||!backup.state||!['members','matches','teams','accounts'].every(k=>Array.isArray(backup.state[k])))throw Error('Choisir une sauvegarde complète Gestion Club.');const status=await api('/api/status');if(token!==epoch||!user||user.user!==owner)return;
 const p=document.createElement('p');p.textContent='Fichier : '+file.name+' · '+backup.state.members.length+' licenciés · '+backup.state.teams.length+' équipes · '+backup.state.matches.length+' matchs. Dépôt préparé sur la révision serveur '+status.revision+'.';E('preview').append(p);draft={backup,expectedRevision:status.revision,owner};E('confirm').disabled=false;message('Vérifiez les effectifs. Le serveur contrôlera aussi le format, les identifiants et l’affiliation.');}catch(e){if(token===epoch){clear();failure(e);}}
});
E('confirm').addEventListener('change',()=>{E('publish').disabled=busy||!draft||!E('confirm').checked;});
E('publish').addEventListener('click',async()=>{
 if(busy||!draft||!E('confirm').checked||draft.owner!==user?.user)return;
 busy=true;E('publish').disabled=true;const token=epoch;
 try{const result=await api('/api/snapshot','PUT',{backup:draft.backup,expectedRevision:draft.expectedRevision,confirmed:true});if(token!==epoch)return;await refresh();message('Révision '+result.revision+' enregistrée. Les versions précédentes sont conservées.');}catch(e){if(token===epoch){clear();failure(e);}}finally{busy=false;}
});
window.addEventListener('pagehide',()=>{clear();user=null;});
api('/api/session').then(async value=>{user=value;await show();}).catch(e=>{hide();if(!e.message.includes('Connexion requise')&&!e.message.includes('expirée'))failure(e);});

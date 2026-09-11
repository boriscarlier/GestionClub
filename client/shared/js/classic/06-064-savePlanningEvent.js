function savePlanningEvent(){
 if(!currentAdminCan('teams','edit'))return toast('Accès refusé','Modification du planning non autorisée.');
 const id=document.getElementById('planningEditId')?.value||'';
 const title=document.getElementById('planningEditTitle')?.value.trim()||'';
 const time=document.getElementById('planningEditTime')?.value||'';
 const place=document.getElementById('planningEditPlace')?.value.trim()||'';
 if(!title||!time||!place)return toast('Planning','Intitulé, heure et lieu sont obligatoires.');
 let ev=id?(state.planning||[]).find(e=>String(e.id)===String(id)):null;
 if(!ev){ev={id:uid('e')};state.planning.push(ev);}
 ev.day=Number(document.getElementById('planningEditDay').value);
 ev.time=time;ev.duration=Math.max(15,Number(document.getElementById('planningEditDuration').value)||60);
 ev.type=document.getElementById('planningEditType').value;
 ev.team=document.getElementById('planningEditTeam').value;
 ev.place=place;ev.title=title;ev.public=true;ev.updatedAt=new Date().toISOString();
 save();
 if(typeof logAdminAction==='function')logAdminAction('Planning',id?'Modification':'Création',title);
 closePlanningEditor();renderPlanning();toast('Planning',id?'Élément modifié.':'Élément ajouté.');
}

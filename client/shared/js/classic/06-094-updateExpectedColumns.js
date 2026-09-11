function updateExpectedColumns(){
 const el=document.getElementById('importExpected');if(!el)return;
 const target=document.getElementById('importTarget')?.value||'members';
 if(target==='discipline'){
  el.innerHTML='<div class="public-list-item"><strong>Dossiers / Discipline</strong><div class="tiny">Excel LRF : Type dossier_2, Statut dossier, Numéro dossier_2, Numéro match, Numéro personne, Nom, prénom personne.</div></div>';
  return;
 }
 if(target==='opponents'){
  el.innerHTML='<div class="public-list-item"><strong>Annuaire clubs adverses</strong><div class="tiny">PDF Footclubs / FFF complet : identité, affiliation, couleurs, niveau, contacts, dirigeants et installations.</div></div>';
  return;
 }
 const schema=importSchemas[target];
 if(!schema){el.innerHTML='<div class="tiny">Aucun schéma disponible.</div>';return;}
 el.innerHTML=schema.fields.map(f=>`<div class="public-list-item"><strong>${f.label}</strong><div class="tiny">${schema.required.includes(f.key)?'Obligatoire':'Optionnel'}</div></div>`).join('');
}

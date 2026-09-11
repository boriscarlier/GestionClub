function downloadImportTemplate(){
 const target=document.getElementById('importTarget').value,schema=importSchemas[target];
 const headers=schema.fields.map(f=>f.label);
 const sample={
  members:['1234567890','88000000','DUPONT','Jean','01/01/2010','M','U17','U17 (- 17 ans)','Active','Renouvellement','Libre','0000000000','jean@example.com','50','50','50','En totalité','Espèces','Nom Parent','0000000000','parent@example.com'],
  teams:['Seniors 1','R3','seniors','Nom éducateur','Nom adjoint','Nom dirigeant','Stade Municipal','Mardi 18h30','Oui'],
  matches:['05/09/2026','18:00','Seniors 1','Adversaire','Stade Municipal','','','À venir'],
  planning:['Samedi','18:00','120','match','Match Seniors 1','Seniors 1','Stade Municipal','Oui'],
  posts:['Titre actualité','Texte de l’actualité','Vie du club','Brouillon','Non','Site;Facebook;Instagram']
 }[target];
 const esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;
 const csv='\ufeff'+headers.map(esc).join(';')+'\n'+sample.map(esc).join(';')+'\n';
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`GESTION_CLUB_modele_${target}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}


const officialLrfDocs2026=[
 {id:'guide',title:'Guide pratique — Licences 2026',category:'Guide',pages:8,url:'https://example.invalid/ligue/wp-content/uploads/sites/116/2025/12/Guide-Pratique-LICENCES-LRF-2026-RUPHINE.pdf',desc:'Guide pratique LRF : calendrier, procédures, catégories d’âge et démarches licences.'},
 {id:'reglement2026',title:'Règlement LRF — Saison 2026',category:'Règlement',pages:'PDF',url:'https://example.invalid/ligue/wp-content/uploads/sites/116/bsk-pdf-manager/1b7695746a49a59d422a4b9bb50581d1.pdf',desc:'Règlement officiel LRF 2026. Document de référence pour les compétitions, licences, qualifications, discipline et procédures applicables à la saison.'},
 {id:'player',title:'Demande de licence — Joueur / Dirigeant / Volontaire',category:'Licence',pages:1,url:'https://example.invalid/ligue/wp-content/uploads/sites/116/2025/12/DEMANDE-DE-LICENCE-JOUEURS-DIRIGEANTS-VOLONTAIRES-2026.pdf',desc:'Bordereau officiel 2026 joueur, dirigeant et volontaire.'},
 {id:'educator',title:'Demande de licence — Éducateur',category:'Éducateur',pages:1,url:'https://example.invalid/ligue/wp-content/uploads/sites/116/2025/12/DEMANDE-DE-LICENCE-EDUCATEURS-2026.pdf',desc:'Bordereau officiel 2026 pour éducateur.'},
 {id:'referee',title:'Demande de licence — Arbitre',category:'Licence',pages:1,url:'https://example.invalid/ligue/wp-content/uploads/sites/116/2025/12/DEMANDE-DE-LICENCE-ARBITRES-2026.pdf',desc:'Bordereau officiel 2026 pour arbitre.'},
 {id:'upgrade',title:'Dossier de surclassement — Article 73.2',category:'Surclassement',pages:4,url:'https://example.invalid/ligue/wp-content/uploads/sites/116/2025/12/DOSSIER-SURCLASSEMENT-ARTICLE-73.2-2026.pdf',desc:'Dossier officiel pour demande de surclassement au titre de l’article 73.2.'},
 {id:'117d',title:'Accord du club quitté — Article 117/d',category:'Mutation',pages:1,url:'https://example.invalid/ligue/wp-content/uploads/sites/116/2025/12/ACCORD-DU-CLUB-pour-le-117.d.pdf',desc:'Accord du club quitté pour application de l’article 117/d des règlements FFF.'},
 {id:'honor',title:'Attestation d’honorabilité — Éducateurs',category:'Éducateur',pages:1,url:'https://example.invalid/ligue/wp-content/uploads/sites/116/2025/12/Attestation-honorabilite-educateur-2026.pdf',desc:'Attestation d’honorabilité officielle destinée aux éducateurs.'},
 {id:'medical',title:'Certificat médical — Renouvellement',category:'Médical',pages:1,url:'https://example.invalid/ligue/wp-content/uploads/sites/116/2025/12/certificat_medical-Renouvellement-Licences-2026.pdf',desc:'Modèle de certificat médical à utiliser dans le cadre d’un renouvellement.'},
 {id:'healthAdult',title:'Questionnaire de santé — Majeur',category:'Médical',pages:1,url:'https://example.invalid/ligue/wp-content/uploads/sites/116/2025/12/questionnaise-sante-MAJEUR-li__2026-1.pdf',desc:'Questionnaire de santé officiel destiné aux licenciés majeurs.'},
 {id:'healthMinor',title:'Questionnaire de santé — Mineur',category:'Médical',pages:2,url:'https://example.invalid/ligue/wp-content/uploads/sites/116/2025/12/questionnaise-sante-MINEUR-min-_-2026.pdf',desc:'Questionnaire de santé officiel destiné aux licenciés mineurs.'}
];
let selectedOfficialDocs=[];


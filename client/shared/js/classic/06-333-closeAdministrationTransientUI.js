function closeAdministrationTransientUI(exceptPage=''){
 // The account editor must never survive navigation outside the account screens.
 if(exceptPage!=='accounts' && exceptPage!=='accountdetail'){
  closeAccountEditor();
 }

 // Close the application's other modal overlays using their native .show state.
 document.querySelectorAll('.modal-bg.show').forEach(modal=>{
  if(modal.id==='accountModal' && (exceptPage==='accounts'||exceptPage==='accountdetail'))return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
 });
}


const ADMIN_PAGE_TITLES={
 dashboard:'Dashboard',
 statistics:'Statistiques',
 'statistics-members':'Répartition des licenciés',
 'statistics-members-advanced':'Statistiques licenciés',
 'statistics-teams':'Statistiques par équipe',
 'statistics-results':'Analyse des résultats',
 'statistics-discipline':'Statistiques discipline',
 'statistics-opponents':'Statistiques adversaires',
 'statistics-data':'Qualité des données',
 members:'Licenciés',
 memberdetail:'Fiche licencié',
 teams:'Équipes',
 teamdetailadmin:'Fiche équipe',
 matches:'Matchs',
 matchdetail:'Détail du match',
 opponents:'Clubs adverses',
 opponentdetail:'Fiche club adverse',
 planning:'Planning global',
 cms:'Actualités CMS',
 communication:'Communication multicanale',
 media:'Médiathèque',
 visual:'Générateur visuel',
 import:'Importation',
 importwatch:'Importations & suivi',fffcontrol:'Sources FFF',
 documentcenter:'Centre documentaire',
 documents:'Documents LRF / FFF',
 discipline:'Discipline',
 admincheck:'Contrôle administratif',
 regcheck:'Contrôle réglementaire',
 alerts:'Centre des alertes',
 accessadmin:'Comptes & permissions',
 accounts:'Comptes utilisateurs',
 accountdetail:'Compte utilisateur',
 permissions:'Permissions',
 auditlog:'Journal des actions',
 accessaudit:'Audit des accès',
 automation:'Automatisations',
 settings:'Paramètres'
};

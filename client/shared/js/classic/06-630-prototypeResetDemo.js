function prototypeResetDemo(){
 if(!confirm('Réinitialiser les données de ce prototype ? Les retours testeurs sont conservés.'))return;
 try{localStorage.setItem('gestionclub_before_demo_reset_backup',JSON.stringify(qaBackupPayload()));[KEY,'gestionclub_coach_lineups','gestionclub_portal_member','gestionclub_coach_member','gestionclub_coach_team'].forEach(k=>localStorage.removeItem(k));sessionStorage.removeItem('gestionclub_admin_account');location.reload();}catch(e){toast('Réinitialisation refusée','Sauvegarde impossible : aucune réinitialisation effectuée.');}
}
document.addEventListener('DOMContentLoaded',()=>{
 ensurePrototypeDemoLineups();
});
ensurePrototypeDemoLineups();


const PROTOTYPE_SCENARIO_KEY='gestionclub_v1222_scenarios';
const PROTOTYPE_SCENARIOS=[
 {id:'public',title:'Site public',goal:'Vérifier la navigation générale.',steps:['Ouvrir Accueil','Consulter Matchs','Ouvrir Nos équipes','Tester le menu mobile/tablette'],action:"showPublicPage('public-home')"},
 {id:'member',title:'Espace adhérent',goal:'Tester le parcours d’un licencié.',steps:['Se connecter avec le compte test','Ouvrir Mon profil','Consulter Matchs & convocations','Consulter Documents et Paiements'],action:'prototypeOpenMemberTest()'},
 {id:'coach-roster',title:'Éducateur — Effectif',goal:'Tester l’effectif et les statistiques joueur.',steps:['Se connecter éducateur','Ouvrir Effectif','Rechercher un joueur','Ouvrir Statistiques'],action:'prototypeOpenCoachTest()'},
 {id:'coach-match',title:'Éducateur — Matchs',goal:'Tester historique et résultats.',steps:['Ouvrir Matchs','Vérifier les matchs joués','Vérifier score, compétition et domicile/extérieur','Ouvrir une composition'],action:'prototypeOpenCoachTest()'},
 {id:'coach-training',title:'Éducateur — Entraînement',goal:'Tester une feuille de présence.',steps:['Ouvrir Entraînements','Créer une séance','Modifier plusieurs présences','Vérifier les statistiques de présence'],action:'prototypeOpenCoachTest()'},
 {id:'admin-dashboard',title:'Administration — Dashboard',goal:'Tester les indicateurs de pilotage.',steps:['Entrer dans Administration','Vérifier Pilotage sportif','Changer de semaine dans Prochains matchs','Vérifier les indicateurs'],action:'prototypeOpenAdminTest()'},
 {id:'member-edit',title:'Administration — Fiche licencié',goal:'Tester l’édition par bloc.',steps:['Ouvrir Licenciés','Ouvrir une fiche','Modifier un bloc','Enregistrer puis vérifier l’affichage'],action:'prototypeOpenAdminTest()'},
 {id:'matches',title:'Administration — Matchs',goal:'Tester filtres et résultats.',steps:['Ouvrir Matchs','Filtrer par équipe','Ouvrir un match terminé','Vérifier score et compétition'],action:'prototypeOpenAdminTest()'}
];

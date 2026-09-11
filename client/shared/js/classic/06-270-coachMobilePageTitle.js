function coachMobilePageTitle(name){
 const labels={
  home:'Tableau de bord',
  roster:'Effectif',
  matches:'Matchs',
  callups:'Convocations',
  lineup:'Composition',
  training:'Entraînements',
  contacts:'Contacts familles'
 };
 return labels[name]||'Portail éducateurs';
}

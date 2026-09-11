function saveVisual(){
 const labelMap={match:'Affiche match',result:'Résultat',birthday:'Anniversaire',partner:'Partenaire',announcement:'Annonce'};
 state.media.unshift({
  id:uid('md'),
  name:`${labelMap[currentVisualTemplate]||'Visuel'} ${new Date().toLocaleString('fr-FR')}`,
  type:'photo',
  team:'Club',
  public:false,
  season:'2026',
  event:'Création graphique',
  album:'Visuels générés',
  rightsOk:true
 });
 save();
 toast('Visuel','Ajouté à la médiathèque.');
}


function ensureDocumentCenterState(){
 if(!state.documentCenter){
  state.documentCenter=[
   {id:'doc-statuts',title:'Statuts de l’association FC LA COUR',category:'Statuts',season:'2026',date:'2026-01-01',status:'Actif',source:'Club',url:'',ref:'STATUTS-2026',description:'Statuts en vigueur de l’association.'},
   {id:'doc-ri',title:'Règlement intérieur FC LA COUR',category:'Règlement intérieur',season:'2026',date:'2026-01-01',status:'Actif',source:'Club',url:'',ref:'RI-2026',description:'Règlement intérieur du club.'},
   {id:'doc-assurance',title:'Attestation / contrat assurance',category:'Assurance',season:'2026',date:'2026-01-01',status:'À compléter',source:'Club',url:'',ref:'',description:'Documents d’assurance de l’association.'},
   {id:'doc-pv',title:'Procès-verbaux du bureau et du CA',category:'Procès-verbal',season:'2026',date:'2026-01-01',status:'Actif',source:'Club',url:'',ref:'',description:'PV des instances du club.'},
   {id:'doc-modeles',title:'Modèles de courriers FC LA COUR',category:'Modèle',season:'2026',date:'2026-01-01',status:'Actif',source:'Club',url:'',ref:'',description:'Bibliothèque de modèles administratifs.'}
  ];
  save();
 }
}

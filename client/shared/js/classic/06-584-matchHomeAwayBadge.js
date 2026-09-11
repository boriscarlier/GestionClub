function matchHomeAwayBadge(m){
 const label=matchHomeAwayLabel(m);
 if(label==='Domicile')return '<span class="badge green">🏠 Domicile</span>';
 if(label==='Extérieur')return '<span class="badge blue">✈️ Extérieur</span>';
 return '<span class="badge">— Non renseigné</span>';
}


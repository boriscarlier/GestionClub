function isReferenceMemberExport(headers){
 const h=headers.map(norm);
 return h.includes(norm('Numéro personne')) &&
        h.includes(norm('Numéro licence')) &&
        h.includes(norm('Statut photo')) &&
        h.includes(norm('Validité Certif Médic N+1')) &&
        h.includes(norm('Etat règlement')) &&
        h.includes(norm('Catégorie arbitre')) &&
        h.includes(norm('Type repr légal 2'));
}

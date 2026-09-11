function isReferenceMatchExport(headers){
 const h=headers.map(norm);
 return h.includes(norm('Numéro match')) &&
        h.includes(norm('Compétition')) &&
        h.includes(norm('Résultat recevant')) &&
        h.includes(norm('Résultat visiteur')) &&
        h.includes(norm('Reporté-rejoué')) &&
        h.includes(norm('Date report'));
}

function isLegacyLrfMatchExport(headers){
 const h=headers.map(norm);
 return h.includes(norm('Compétition / Phase')) &&
        h.includes(norm('Equipe locale')) &&
        h.includes(norm('Club adverse'));
}

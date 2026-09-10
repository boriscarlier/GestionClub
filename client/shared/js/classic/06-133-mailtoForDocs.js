function mailtoForDocs(docs,email){
 const subject=encodeURIComponent('FC LA COUR — Documents licences LRF 2026');
 const body=encodeURIComponent('Bonjour,\n\nVous trouverez ci-dessous les documents officiels LRF 2026 demandés :\n\n'+docs.map(d=>'• '+d.title+'\n'+d.url).join('\n\n')+'\n\nCordialement,\nFC LA COUR');
 return `mailto:${encodeURIComponent(email||'')}?subject=${subject}&body=${body}`;
}

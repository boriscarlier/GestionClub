function mailtoForDocs(docs,email){
 const subject=encodeURIComponent('CLUB EXEMPLE — Documents licences LRF 2026');
 const body=encodeURIComponent('Bonjour,\n\nVous trouverez ci-dessous les documents officiels LRF 2026 demandés :\n\n'+docs.map(d=>'• '+d.title+'\n'+d.url).join('\n\n')+'\n\nCordialement,\nCLUB EXEMPLE');
 return `mailto:${encodeURIComponent(email||'')}?subject=${subject}&body=${body}`;
}

function prototypeExportFeedbackCsv(){
 const items=prototypeFeedbackItems();
 if(!items.length)return toast('Export','Aucun retour à exporter.');
 const headers=['ID','Testeur','Type','Zone','Priorité','Titre','Description','Date','Build','Écran'];
 const rows=items.map(x=>[x.id,x.tester,x.type,x.area,x.priority,x.title,x.description,x.createdAt,x.build,x.viewport]);
 const csv='\uFEFF'+[headers,...rows].map(r=>r.map(prototypeCsvCell).join(';')).join('\r\n');
 prototypeDownloadText(`FC_LA_COUR_retours_test_${new Date().toISOString().slice(0,10)}.csv`,csv,'text/csv;charset=utf-8');
}

function prototypeExportFeedbackJson(){
 const items=prototypeFeedbackItems();
 if(!items.length)return toast('Export','Aucun retour à exporter.');
 const payload={app:'CLUB EXEMPLE Manager',domain:'gestionclub.local',build:QA_BUILD,exportedAt:new Date().toISOString(),feedback:items};
 prototypeDownloadText(`GESTION_CLUB_retours_test_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(payload,null,2),'application/json');
}


window.addEventListener('resize',()=>{
 if(window.innerWidth>768)toggleCoachMobileMore(false);
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape')toggleCoachMobileMore(false);
});



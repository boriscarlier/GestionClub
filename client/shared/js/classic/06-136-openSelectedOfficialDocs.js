function openSelectedOfficialDocs(){
 const docs=selectedOfficialDocs.map(officialDocById).filter(Boolean);
 if(!docs.length)return toast('Documents','Sélectionne au moins un document.');
 docs.forEach((d,i)=>setTimeout(()=>window.open(d.url,'_blank'),i*180));
 toast('Documents','Les PDF officiels sélectionnés sont ouverts pour impression.');
}



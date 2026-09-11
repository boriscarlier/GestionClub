function toggleOfficialDoc(id,val){
 if(val&&!selectedOfficialDocs.includes(id))selectedOfficialDocs.push(id);
 if(!val)selectedOfficialDocs=selectedOfficialDocs.filter(x=>x!==id);
 renderOfficialDocs();
}

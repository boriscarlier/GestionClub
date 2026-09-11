function emailDocumentRecord(id){
 const d=documentCenterAll().find(x=>x.id===id);if(!d)return;
 const subject=encodeURIComponent('CLUB EXEMPLE — '+d.title);
 const body=encodeURIComponent(`${d.title}\n${d.description||''}\n${d.url||''}`);
 location.href=`mailto:?subject=${subject}&body=${body}`;
}


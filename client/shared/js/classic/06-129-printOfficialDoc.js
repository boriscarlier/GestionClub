function printOfficialDoc(id){
 const d=officialDocById(id);if(!d)return;
 window.open(d.url,'_blank');
 toast('Document','Le PDF officiel est ouvert : utilise la commande Imprimer du navigateur.');
}

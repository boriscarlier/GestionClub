function openDocumentsForIssue(kind){
 const map={medical:'medical',guardian:'',license:'player',transfer:'117d',upgrade:'upgrade',discipline:'reglement2026',contact:'',payment:''};
 const id=map[kind]||'';
 if(id&&typeof openOfficialDoc==='function'){openOfficialDoc(id);return;}
 goTo('documents');
}


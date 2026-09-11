function cancelOpponentFffImport(){
 opponentFffImportDraft=null;
 opponentFffDirectoryDraft=[];
 window.__fffDirectoryDiagnostics=[];
 window.__opponentFffPendingData=null;
 const file=document.getElementById('oppFffPdfFile');
 if(file)file.value='';
 const status=document.getElementById('oppFffImportStatus');
 const result=document.getElementById('oppFffImportResult');
 if(status)status.textContent='Aucun fichier chargé.';
 if(result)result.innerHTML='';
}

let currentOpponentId=null;
let currentOpponentEditId=null;


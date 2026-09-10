async function ensurePdfJs(){
 if(window.pdfjsLib)return window.pdfjsLib;
 if(opponentFffPdfLibLoading)return opponentFffPdfLibLoading;

 opponentFffPdfLibLoading=new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  script.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  script.onload=()=>{
   try{
    window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    resolve(window.pdfjsLib);
   }catch(e){reject(e)}
  };
  script.onerror=()=>reject(new Error('Impossible de charger le lecteur PDF.'));
  document.head.appendChild(script);
 });
 return opponentFffPdfLibLoading;
}

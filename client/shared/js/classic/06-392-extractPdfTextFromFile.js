async function extractPdfTextFromFile(file){
 const pdfjs=await ensurePdfJs();
 const bytes=new Uint8Array(await file.arrayBuffer());
 const pdf=await pdfjs.getDocument({data:bytes}).promise;
 let all='';
 for(let i=1;i<=pdf.numPages;i++){
  const page=await pdf.getPage(i);
  const content=await page.getTextContent();
  const text=content.items.map(it=>it.str).join(' ');
  all += '\n'+text;
 }
 return all;
}

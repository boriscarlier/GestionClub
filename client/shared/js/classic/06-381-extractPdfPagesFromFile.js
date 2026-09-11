async function extractPdfPagesFromFile(file){
 const pdfjs=await ensurePdfJs();
 const bytes=new Uint8Array(await file.arrayBuffer());
 const pdf=await pdfjs.getDocument({data:bytes}).promise;
 const pages=[];
 for(let i=1;i<=pdf.numPages;i++){
  const page=await pdf.getPage(i);
  const viewport=page.getViewport({scale:1});
  const content=await page.getTextContent();
  const items=content.items
   .filter(it=>String(it.str||'').trim())
   .map(it=>({
    str:String(it.str||'').trim(),
    x:it.transform?.[4]||0,
    y:it.transform?.[5]||0,
    width:it.width||0,
    height:it.height||0
   }));
  const rows=groupPdfItemsIntoRows(items);
  pages.push({
   page:i,
   width:viewport.width,
   height:viewport.height,
   items,
   text:rows.map(r=>r.text).join('\n')
  });
 }
 return pages;
}


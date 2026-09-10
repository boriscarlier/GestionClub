function groupPdfItemsIntoRows(items){
 const sorted=[...(items||[])].sort((a,b)=>{
  if(Math.abs(b.y-a.y)>2)return b.y-a.y;
  return a.x-b.x;
 });
 const rows=[];
 let current=null;
 sorted.forEach(it=>{
  if(!current || Math.abs(it.y-current.y)>2){
   current={y:it.y,items:[it]};
   rows.push(current);
  }else{
   current.items.push(it);
  }
 });
 rows.forEach(r=>{
  r.items.sort((a,b)=>a.x-b.x);
  r.text=r.items.map(i=>i.str).join(' ').replace(/\s+/g,' ').trim();
 });
 return rows;
}


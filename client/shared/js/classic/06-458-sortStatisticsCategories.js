function sortStatisticsCategories(entries){
 return entries.sort((a,b)=>{
  const oa=statisticsCategoryOrder(a[0]),ob=statisticsCategoryOrder(b[0]);
  if(oa!==ob)return oa-ob;
  return String(a[0]).localeCompare(String(b[0]),'fr',{numeric:true,sensitivity:'base'});
 });
}


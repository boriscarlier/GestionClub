function migrateCms(){
 if(!Array.isArray(state.posts))state.posts=[];
 state.posts.forEach((p,i)=>{
  if(!p.id)p.id=uid('p');
  if(!p.category)p.category='Vie du club';
  if(!p.created)p.created=new Date().toISOString();
  if(typeof p.featured==='undefined')p.featured=(i===0);
  if(!p.status)p.status='Publié';
  if(p.status==='Publiée')p.status='Publié';
  if(!p.publishDate)p.publishDate='';
  if(!Array.isArray(p.channels))p.channels=p.channels?[p.channels]:['Site'];
  p.channels=[...new Set(p.channels.filter(Boolean))];
 });
}


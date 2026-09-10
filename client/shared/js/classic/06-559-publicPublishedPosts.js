function publicPublishedPosts(){
 return (state.posts||[])
  .filter(p=>['Publié','Publiée'].includes(typeof normalizeCommunicationStatus==='function'?normalizeCommunicationStatus(p.status):p.status) || ['Publié','Publiée'].includes(p.status))
  .filter(postHasPublicSiteChannel)
  .sort((a,b)=>{
   const featured=(b.featured?1:0)-(a.featured?1:0);
   if(featured)return featured;
   return String(b.updatedAt||b.date||'').localeCompare(String(a.updatedAt||a.date||''));
  });
}

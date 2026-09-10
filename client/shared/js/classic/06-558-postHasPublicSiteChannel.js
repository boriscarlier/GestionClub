function postHasPublicSiteChannel(post){
 const c=post?.channels;
 if(Array.isArray(c))return c.some(x=>norm(x)==='site'||norm(x)==='site web');
 if(c&&typeof c==='object')return !!c.site;
 return false;
}

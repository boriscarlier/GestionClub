function qaChannels(post){
 const c=post?.channels;
 if(Array.isArray(c))return c.map(String);
 if(c&&typeof c==='object')return Object.entries(c).filter(([,v])=>v===true).map(([k])=>({site:'Site',facebook:'Facebook',instagram:'Instagram',youtube:'YouTube',whatsapp:'WhatsApp'}[k]||k));
 return typeof c==='string'?c.split(/[,;|]/).map(x=>x.trim()).filter(Boolean):[];
}


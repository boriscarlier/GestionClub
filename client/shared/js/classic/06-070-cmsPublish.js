function cmsPublish(id){const p=state.posts.find(x=>x.id===id);if(!p)return;p.status='Publié';p.channels=[...new Set([...qaChannels(p),'Site'])];save();toast('CMS','Article publié sur le site.')}

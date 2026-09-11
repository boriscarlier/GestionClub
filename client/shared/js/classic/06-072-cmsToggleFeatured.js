function cmsToggleFeatured(id){state.posts.forEach(p=>p.featured=false);const p=state.posts.find(x=>x.id===id);if(p)p.featured=true;save()}


let selectedMediaIds=[];


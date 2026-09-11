function cmsCycleStatus(id){const p=state.posts.find(x=>x.id===id);if(!p)return;const s=['Brouillon','À valider','Programmé','Publié'];p.status=s[(s.indexOf(p.status)+1)%s.length];save()}

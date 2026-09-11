function renderCommunicationChannelSummary(){
 const root=document.getElementById('commChannelSummary');if(!root)return;
 const posts=state.posts||[];
 root.innerHTML=COMM_CHANNELS.map(([key,label,icon])=>{
  const total=posts.filter(p=>p.channels?.[key]).length;
  return `<div class="comm-channel-card"><span class="tiny">${icon} ${label}</span><strong>${total}</strong><div class="tiny">publication${total>1?'s':''} configurée${total>1?'s':''}</div></div>`;
 }).join('');
}

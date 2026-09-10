function renderCommunicationWorkflowSummary(){
 const root=document.getElementById('commWorkflowSummary');if(!root)return;
 const counts=communicationStatusCounts();
 root.innerHTML=COMM_STATUSES.map(s=>`<span class="comm-flow-step ${counts[s]?'active':''}">${escapeHtml(s)} • ${counts[s]}</span>`).join('');
}

function communicationStatusCounts(){
 const posts=state.posts||[];
 const out={};
 COMM_STATUSES.forEach(s=>out[s]=posts.filter(p=>normalizeCommunicationStatus(p.status)===s).length);
 return out;
}

function importStatusBadge(st){
 if(st.status==='ok')return `<span class="badge green">À jour</span>`;
 if(st.status==='warn')return `<span class="badge yellow">À surveiller</span>`;
 return `<span class="badge red">Obsolète</span>`;
}

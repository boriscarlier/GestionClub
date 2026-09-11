function renderStatisticsDiscipline(){
 const ds=state.discipline||[];const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('sdTotal',ds.length);set('sdActive',ds.filter(d=>d.isActive===true||norm(d.status||'').includes('actif')).length);
 set('sdYellow',ds.reduce((s,d)=>s+(Number(d.yellowCards)||0),0));set('sdRed',ds.reduce((s,d)=>s+(Number(d.redCards)||0),0));
 const teams=statsCountBy(ds,d=>d.team||'Équipe non renseignée');
 const statuses=statsCountBy(ds,d=>d.status||'Statut non renseigné');
 const people=statsCountBy(ds,d=>d.personName||d.personNumber||'Personne non renseignée');
 const months=statsCountBy(ds,d=>String(d.matchDate||d.startDate||d.date||'Date inconnue').slice(0,7)||'Date inconnue');
 for(const [id,obj,lim] of [['sdTeams',teams,20],['sdStatuses',statuses,20],['sdPeople',people,15],['sdMonths',months,24]]){const e=document.getElementById(id);if(e)e.innerHTML=statsBarsHtml(obj,lim)}
}



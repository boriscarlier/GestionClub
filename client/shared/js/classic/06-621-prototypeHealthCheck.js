function prototypeHealthCheck(){
 const seen=new Set(),duplicates=[];document.querySelectorAll('[id]').forEach(e=>{if(seen.has(e.id))duplicates.push(e.id);seen.add(e.id);});
 return {build:QA_BUILD,duplicateIds:[...new Set(duplicates)],publicApp:!!document.getElementById('publicApp'),adminApp:!!document.getElementById('intranetApp'),memberPortal:!!document.getElementById('portalApp'),coachPortal:!!document.getElementById('coachApp'),responsive:document.querySelectorAll('meta[name="viewport"]').length===1,mode:'Prototype local — pas d’authentification serveur',automatedAudit:'Contrôles contacts intégrés V1.22.13 ; validation navigateur à effectuer'};
}
document.addEventListener('DOMContentLoaded',()=>{window.FC_LA_COUR_HEALTH=prototypeHealthCheck();});



// ===== V1.22.1 — JEU DE DONNEES REALISTE FC LA COUR 2026 =====

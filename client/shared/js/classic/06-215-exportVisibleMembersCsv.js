function exportVisibleMembersCsv(){
 const list=filteredMembers();
 const headers=['Nom','Prénom','N° personne','N° licence','Type','Catégorie','Statut','Téléphone','Email','Paiement','Discipline'];
 const rows=list.map(m=>[m.last,m.first,m.personNumber,m.licenseNumber,m.type||m.licenseType,m.category||m.subcategory,m.license||m.status,m.phone||m.mobile,m.email,m.paymentState,isMemberSuspended(m)?'Suspendu':memberDisciplineRisk(m).length?'Alerte':'RAS']);
 const esc=v=>`"${String(v??'').replace(/"/g,'""')}"`;
 const csv='\ufeff'+[headers,...rows].map(r=>r.map(esc).join(';')).join('\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');
 a.href=URL.createObjectURL(blob);a.download='FC_LA_COUR_licencies_filtres.csv';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}

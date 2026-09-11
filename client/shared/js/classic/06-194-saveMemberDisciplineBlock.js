function saveMemberDisciplineBlock(){
 const m=(state.members||[]).find(x=>x.id===currentMemberId);if(!m)return;
 if(!qaCanEditBlock('discipline'))return toast('Accès refusé','Modification des licenciés non autorisée.');
 if(!qaValidateMemberBlock('discipline'))return;
 const ds=disciplineForMember(m);
 ds.forEach((d,index)=>{
  d.dossierNumber=memberValue(`editDiscNumber_${index}`);
  d.status=memberValue(`editDiscStatus_${index}`);
  d.matchNumber=memberValue(`editDiscMatchNumber_${index}`);
  d.matchDate=memberValue(`editDiscMatchDate_${index}`);
  d.reason=memberValue(`editDiscReason_${index}`);
  d.decision=memberValue(`editDiscDecision_${index}`);
  d.effectDate=memberValue(`editDiscEffectDate_${index}`);
  d.endDate=memberValue(`editDiscEndDate_${index}`);
  d.updatedAt=new Date().toISOString();
 });
 localStorage.setItem(KEY,JSON.stringify(state));
 if(typeof logAdminAction==='function')logAdminAction('Licenciés','Modification discipline',`${m.last||''} ${m.first||''} • ${ds.length} dossier(s)`);
 memberBlockEditState.delete('discipline');
 renderMemberDetail();
 if(typeof renderDiscipline==='function')renderDiscipline();
 toast('Discipline','Dossier(s) enregistré(s).');
}

function toggleMemberSelection(id,checked){
 if(checked&&!selectedMemberIds.includes(id))selectedMemberIds.push(id);
 if(!checked)selectedMemberIds=selectedMemberIds.filter(x=>x!==id);
 renderMembers();
 renderAdministrativeChecks();
 renderRegulatoryChecks();
 renderAutomation();
 renderAlertCenter();
}

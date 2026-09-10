function closeAccountEditor(){
 const modal=document.getElementById('accountModal');
 if(modal){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
 }
 currentAccountId=null;
 const ids=['accFirst','accLast','accEmail','accFunction','accNote'];
 ids.forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
 const status=document.getElementById('accStatus');if(status)status.value='active';
 const member=document.getElementById('accMemberLink');if(member)member.value='';
 const roles=document.getElementById('accRoles');if(roles)[...roles.options].forEach(o=>o.selected=false);
 const scope=document.getElementById('accScopeType');if(scope)scope.value='club';
 const teams=document.getElementById('accScopeTeams');if(teams)[...teams.options].forEach(o=>o.selected=false);
}

document.addEventListener('keydown',event=>{
 if(event.key==='Escape' && document.getElementById('accountModal')?.classList.contains('show')){
  closeAccountEditor();
 }
});


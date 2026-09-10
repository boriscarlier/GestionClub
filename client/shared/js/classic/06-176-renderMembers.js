function renderMembers(){
 const tbody=document.getElementById('memberRows');if(!tbody)return;
 if(serverMembersEnabled()&&!serverMembersState.loaded&&!serverMembersState.loading)refreshServerMembers().then(()=>renderMembers());
 updateMemberDataSource();
 fillMemberFilters();

 const list=filteredMembers();
 const resultCount=document.getElementById('memberResultCount');
 const selectedCount=document.getElementById('memberSelectedCount');
 if(resultCount)resultCount.textContent=list.length;
 if(selectedCount)selectedCount.textContent=selectedMemberIds.length;

 const allBox=document.getElementById('memberSelectAll');
 if(allBox)allBox.checked=list.length>0&&list.every(m=>selectedMemberIds.includes(m.id));

 const addBtn=document.getElementById('memberAddBtn');
 if(addBtn)addBtn.style.display=currentAdminCan('members','create')?'':'none';

 const account=typeof currentAdminAccount==='function'?currentAdminAccount():null;
 const unrestricted=!(state.accounts||[]).length;
 const canContact=unrestricted || (typeof accountCanSeeSensitive==='function'&&accountCanSeeSensitive(account,'contact'));
 const canDiscipline=unrestricted || (typeof accountCanSeeSensitive==='function'&&accountCanSeeSensitive(account,'discipline'));

 tbody.innerHTML=list.map(m=>{
  const risks=canDiscipline?memberDisciplineRisk(m):[];
  const susp=canDiscipline?isMemberSuspended(m):false;
  const selected=selectedMemberIds.includes(m.id);
  const phone=canContact?(m.phone||m.mobile||'—'):'Accès restreint';
  const email=canContact?(m.email||'—'):'Accès restreint';
  const discipline=canDiscipline
   ? (susp?'<span class="badge red">Suspendu</span>':risks.length?'<span class="badge yellow">Alerte</span>':'<span class="badge green">RAS</span>')
   : '<span class="badge">Restreint</span>';

  return `<tr class="member-row ${selected?'selected':''}" onclick="openMemberDetail('${m.id}',event)">
   <td onclick="event.stopPropagation()"><input type="checkbox" ${selected?'checked':''} onchange="toggleMemberSelection('${m.id}',this.checked)"></td>
   <td><strong>${escapeHtml(`${m.last||''} ${m.first||''}`.trim())}</strong><div class="tiny">N° personne : ${escapeHtml(m.personNumber||'—')}</div></td>
   <td>${escapeHtml(m.licenseNumber||'—')}</td>
   <td>${escapeHtml(m.type||m.licenseType||'—')}</td>
   <td>${escapeHtml(m.category||m.subcategory||'—')}</td>
   <td><span class="badge ${norm(m.license||m.status)==='active'||norm(m.license)==='validee'?'green':'yellow'}">${escapeHtml(m.license||m.status||'—')}</span></td>
   <td>${escapeHtml(phone)}</td>
   <td>${escapeHtml(email)}</td>
   <td>${discipline}</td>
  </tr>`;
 }).join('')||'<tr><td colspan="9">Aucun licencié correspondant.</td></tr>';
}

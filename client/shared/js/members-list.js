(function(){
  const statusNode = document.querySelector('[data-members-status]');
  const rowsNode = document.querySelector('[data-members-rows]');
  const totalNode = document.querySelector('[data-members-total]');
  const filterNode = document.querySelector('[data-members-filter]');
  let members = [];

  function setStatus(message){
    if(statusNode) statusNode.textContent = message;
  }

  function text(value){
    return value === undefined || value === null || value === '' ? '-' : String(value);
  }

  function memberName(member){
    return member.fullName || [member.last, member.first].filter(Boolean).join(' ') || member.name || 'Sans nom';
  }

  function contact(member){
    return member.email || member.phone || member.mobile || '-';
  }

  function row(member){
    const tr = document.createElement('tr');
    [memberName(member), member.licenseNumber || member.license || member.licence, member.category, contact(member)].forEach(function(value){
      const td = document.createElement('td');
      td.textContent = text(value);
      tr.appendChild(td);
    });
    return tr;
  }

  function render(){
    const query = (filterNode && filterNode.value || '').trim().toLowerCase();
    const visible = members.filter(function(member){
      if(!query) return true;
      return [memberName(member), member.licenseNumber, member.license, member.licence, member.category, contact(member)].join(' ').toLowerCase().includes(query);
    });
    if(totalNode) totalNode.textContent = String(visible.length);
    rowsNode.replaceChildren();
    if(!visible.length){
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 4;
      td.textContent = query ? 'Aucun licencie ne correspond au filtre.' : 'Aucun licencie disponible dans la revision serveur.';
      tr.appendChild(td);
      rowsNode.appendChild(tr);
      return;
    }
    visible.slice(0, 500).forEach(function(member){ rowsNode.appendChild(row(member)); });
  }

  async function load(){
    try{
      await fetch('/api/session', {credentials:'same-origin', cache:'no-store'}).then(function(response){
        if(!response.ok) throw new Error('Connexion serveur requise.');
        return response.json();
      });
      const response = await fetch('/api/state/members?limit=500', {credentials:'same-origin', cache:'no-store'});
      const data = await response.json();
      if(!response.ok) throw new Error(data.error || 'Lecture des licencies impossible.');
      members = Array.isArray(data.members) ? data.members : [];
      setStatus('Page shadow chargee depuis le serveur. Le Manager complet reste le rollback.');
      render();
    }catch(error){
      members = [];
      setStatus(error.message + ' Utilisez le rollback Manager stable.');
      render();
    }
  }

  if(filterNode) filterNode.addEventListener('input', render);
  load();
})();

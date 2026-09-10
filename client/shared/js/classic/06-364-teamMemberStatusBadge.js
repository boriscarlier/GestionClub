function teamMemberStatusBadge(stateObj){
 if(stateObj.level==='suspended')return `<span class="badge red">${stateObj.label}</span>`;
 if(stateObj.level==='warning')return `<span class="badge yellow">${stateObj.label}</span>`;
 return `<span class="badge green">${stateObj.label}</span>`;
}


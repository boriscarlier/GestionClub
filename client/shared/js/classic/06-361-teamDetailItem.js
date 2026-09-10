function teamDetailItem(label,value){
 const safe=(value===null||value===undefined||value==='')?'—':value;
 return `<div class="team-detail-card"><div class="label">${label}</div><div class="value">${safe}</div></div>`;
}


function opponentDetailField(label,value){
 const safe=(value===null||value===undefined||value==='')?'—':value;
 return `<div class="opponent-detail-field"><div class="label">${label}</div><strong>${safe}</strong></div>`;
}

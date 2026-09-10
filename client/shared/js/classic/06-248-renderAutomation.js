function renderAutomation(){
 const rulesEl=document.getElementById('automationRules');if(!rulesEl)return;
 ensureAutomationDefaults();
 const props=(state.automationProposals||[]).filter(p=>p.status==='pending');
 document.getElementById('autoRulesCount').textContent=state.automationRules.filter(r=>r.enabled).length;
 document.getElementById('autoProposalCount').textContent=props.length;
 document.getElementById('autoCriticalCount').textContent=props.filter(p=>p.severity==='critical').length;
 document.getElementById('autoLastRun').textContent=state.automationLastRun||'—';
 rulesEl.innerHTML=state.automationRules.map(r=>`<div class="auto-rule ${r.enabled?'':'off'}"><div class="top"><div><strong>${r.name}</strong><div class="tiny">${r.desc}</div></div><label><input type="checkbox" ${r.enabled?'checked':''} onchange="toggleAutomationRule('${r.id}',this.checked)"> actif</label></div></div>`).join('');
 const pe=document.getElementById('automationProposals');
 pe.innerHTML=props.length?props.map(p=>`<div class="auto-proposal ${p.severity||'info'}"><strong>${p.title}</strong><div class="tiny">${p.text||''}</div><div class="auto-actions"><button class="primary" onclick="approveAutomationProposal('${p.id}')">Valider</button><button class="ghost" onclick="dismissAutomationProposal('${p.id}')">Ignorer</button>${p.actionPage?`<button class="ghost" onclick="goTo('${p.actionPage}')">Ouvrir</button>`:''}</div></div>`).join(''):'<div class="tiny">Aucune proposition en attente.</div>';
 const le=document.getElementById('automationLog');
 le.innerHTML=(state.automationLog||[]).length?state.automationLog.slice(0,30).map(l=>`<div class="auto-log"><strong>${l.date}</strong><div class="tiny">${l.text}</div></div>`).join(''):'<div class="tiny">Aucun historique.</div>';
}



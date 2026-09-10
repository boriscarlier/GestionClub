function prototypeRenderScenarios(){
 const root=document.getElementById('prototypeScenarioList');if(!root)return;
 const st=prototypeScenarioState();
 const done=PROTOTYPE_SCENARIOS.filter(s=>st[s.id]).length;
 const pct=Math.round(done/PROTOTYPE_SCENARIOS.length*100);
 const txt=document.getElementById('prototypeScenarioProgressText');
 const bar=document.getElementById('prototypeScenarioProgressBar');
 if(txt)txt.textContent=`${done} / ${PROTOTYPE_SCENARIOS.length} terminé${done>1?'s':''}`;
 if(bar)bar.style.width=pct+'%';
 root.innerHTML=PROTOTYPE_SCENARIOS.map(s=>`<div class="prototype-scenario-card ${st[s.id]?'done':''}">
  <div class="prototype-scenario-head">
   <div><strong>${escapeHtml(s.title)}</strong><div class="tiny">${escapeHtml(s.goal)}</div></div>
   <label><input type="checkbox" ${st[s.id]?'checked':''} onchange="prototypeToggleScenario('${s.id}')"> Terminé</label>
  </div>
  <ol class="prototype-scenario-steps">${s.steps.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ol>
  <div class="prototype-scenario-actions"><button class="secondary" onclick="prototypeLaunchScenario('${s.id}')">Ouvrir ce test</button></div>
 </div>`).join('');
}


const PROTOTYPE_FEEDBACK_KEY='fclc_v1223_feedback';

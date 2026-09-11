function coachAvailabilitySelectHtml(player){
 const st=coachPlayerStatus(player);
 const current=['injured','absent'].includes(st.status)?st.status:'available';
 const disabled=st.status==='blocked';
 return `<div class="coach-sport-status">
  <select ${disabled?'disabled':''} onchange="setCoachPlayerAvailability('${player.id}',this.value)">
   <option value="available" ${current==='available'?'selected':''}>Disponible</option>
   <option value="injured" ${current==='injured'?'selected':''}>Blessé</option>
   <option value="absent" ${current==='absent'?'selected':''}>Absent</option>
  </select>
  ${st.updatedAt?`<span class="coach-status-updated">Maj ${formatAccountDate(st.updatedAt)}</span>`:''}
 </div>`;
}


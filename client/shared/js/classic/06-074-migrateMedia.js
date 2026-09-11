function migrateMedia(){
 state.media.forEach(m=>{
  if(!m.season)m.season='2026';
  if(!m.event)m.event='Club';
  if(!m.album)m.album=m.team||'Club';
  if(typeof m.rightsOk==='undefined')m.rightsOk=true;
 });
}

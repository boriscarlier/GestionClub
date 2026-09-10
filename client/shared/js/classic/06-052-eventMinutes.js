function eventMinutes(ev){
 const p=String(ev.time||'00:00').split(':').map(Number);
 return (p[0]||0)*60+(p[1]||0);
}

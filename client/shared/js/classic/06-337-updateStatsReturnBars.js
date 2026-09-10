function updateStatsReturnBars(page){
 const active=(statsDrilldownOrigin || sessionStorage.getItem('fclc_stats_drilldown')==='1') && page!=='statistics';
 document.querySelectorAll('.stats-return-bar').forEach(el=>el.classList.remove('show'));
 if(!active)return;
 const target=document.getElementById(`statsReturn-${page}`);
 if(target)target.classList.add('show');
}


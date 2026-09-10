function openStatsDetail(page){
 statsDrilldownOrigin=true;
 sessionStorage.setItem('fclc_stats_drilldown','1');
 goTo(page);
 updateStatsReturnBars(page);
}


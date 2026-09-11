function openStatsDetail(page){
 statsDrilldownOrigin=true;
 sessionStorage.setItem('gestionclub_stats_drilldown','1');
 goTo(page);
 updateStatsReturnBars(page);
}


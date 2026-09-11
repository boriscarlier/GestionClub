function serverTeamsEnabled(){
 return !!(window.GESTION_CLUB_SERVER_BRIDGE&&window.GESTION_CLUB_SERVER_BRIDGE.mode==='server-bridge'&&location.protocol!=='file:');
}

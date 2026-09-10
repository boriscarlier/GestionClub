function serverMembersEnabled(){
 return !!(window.FC_LA_COUR_SERVER_BRIDGE&&window.FC_LA_COUR_SERVER_BRIDGE.mode==='server-bridge'&&location.protocol!=='file:');
}

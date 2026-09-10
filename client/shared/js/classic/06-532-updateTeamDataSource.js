function updateTeamDataSource(){
 const node=document.getElementById('teamDataSource');if(!node)return;
 if(!serverTeamsEnabled()){node.textContent='Source : base locale';return;}
 if(serverTeamsState.loading){node.textContent='Source : serveur SQL/API · chargement...';return;}
 if(serverTeamsState.error){node.textContent='Source : base locale · serveur indisponible : '+serverTeamsState.error;return;}
 if(serverTeamsState.loaded){node.textContent='Source : serveur SQL/API · révision '+(serverTeamsState.revision||'—')+' · '+serverTeamsState.total+' équipe(s)';return;}
 node.textContent='Source : serveur SQL/API · en attente';
}

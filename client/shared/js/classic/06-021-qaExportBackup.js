function qaExportBackup(){
 if(!currentAdminCan('settings','view'))return toast('Accès refusé','Connectez-vous à l’Administration pour exporter la base complète.');
 prototypeDownloadText(`GESTION_CLUB_sauvegarde_complete_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(qaBackupPayload(),null,2),'application/json');
}


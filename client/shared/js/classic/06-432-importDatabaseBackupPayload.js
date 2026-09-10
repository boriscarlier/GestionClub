function importDatabaseBackupPayload(){
 const full=qaBackupPayload();return {exportedAt:full.exportedAt,version:QA_BUILD,data:{members:state.members||[],matches:state.matches||[],discipline:state.discipline||[],opponents:state.opponents||[],importRegistry:state.importRegistry||{},importHistory:state.importHistory||[]},fullBackup:full};
}

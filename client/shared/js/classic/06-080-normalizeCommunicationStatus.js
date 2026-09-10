function normalizeCommunicationStatus(status){
 return COMM_STATUSES.includes(status)?status:'Brouillon';
}

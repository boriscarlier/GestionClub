function regulatoryIssueDateState(issue){
 const today=disciplineToday(),start=disciplineDateOnly(issue.effectDate),end=disciplineDateOnly(issue.endDate);
 if((issue.effectDate&&!start)||(issue.endDate&&!end)||(start&&end&&end<start))return {expired:false,invalid:true,label:'Dates incohérentes ou invalides'};
 if(end&&end<today)return {expired:true,invalid:false,label:`Échu le ${formatDisciplineDate(issue.endDate)}`};
 if(start&&start>today)return {expired:false,invalid:false,label:`À venir le ${formatDisciplineDate(issue.effectDate)}`};
 return {expired:false,invalid:false,label:start||end?'Période en cours / à vérifier':''};
}

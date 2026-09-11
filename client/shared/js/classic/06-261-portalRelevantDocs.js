function portalRelevantDocs(m){
 return relevantDocsForMember(m).map(officialDocById).filter(Boolean);
}

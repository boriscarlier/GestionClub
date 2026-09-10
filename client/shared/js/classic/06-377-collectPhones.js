function collectPhones(text){
 return [...new Set((String(text).match(/(?:0|\+33)[0-9 .()-]{8,17}/g)||[]).map(cleanFffValue))];
}



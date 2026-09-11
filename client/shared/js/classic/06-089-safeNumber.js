function safeNumber(v){
 if(v===''||v==null)return null;
 const n=Number(String(v).replace(',','.')); return Number.isFinite(n)?n:null;
}

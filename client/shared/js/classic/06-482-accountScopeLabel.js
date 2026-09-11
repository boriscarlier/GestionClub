function accountScopeLabel(a){
 const s=a?.scope||{type:'club'};
 if(s.type==='club')return 'Tout le club';
 if(s.type==='sport')return 'Tout le sportif';
 if(s.type==='team')return `Équipe(s) : ${(s.teams||[]).join(', ')||'non définie'}`;
 if(s.type==='category')return `Catégorie(s) : ${(s.teams||[]).join(', ')||'non définie'}`;
 return s.type;
}


const SENSITIVE_FIELDS={
 contact:['phone','mobile','homePhone','workPhone','email','otherEmail','address','street','postalCode','postOffice'],
 guardians:['guardianName','guardianPhone','guardianEmail','guardian1Name','guardian1Mobile','guardian1Email','guardian2Name','guardian2Mobile','guardian2Email'],
 discipline:['discipline'],
 finance:['priceApplied','clubPrice','paymentAmount','paymentState','paymentDate','paymentMode']
};

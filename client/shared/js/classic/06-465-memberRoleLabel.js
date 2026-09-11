function memberRoleLabel(m){
 const txt=[m.licenseType,m.type,...(Array.isArray(m.roles)?m.roles:[])].map(x=>norm(x||'')).join(' ');
 if(txt.includes('arbit'))return 'Arbitres';
 if(txt.includes('educ'))return 'Éducateurs';
 if(txt.includes('dirige'))return 'Dirigeants';
 if(txt.includes('joueur')||txt.includes('libre'))return 'Joueurs';
 return m.licenseType||m.type||'Autres';
}

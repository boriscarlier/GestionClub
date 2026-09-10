function adaptPostText(post, channel){
  var txt = post.text || '';
  if(channel==='Site') return txt;
  if(channel==='Facebook') return post.title + '\n\n' + txt + '\n\n💚 FC LA COUR';
  if(channel==='Instagram') return post.title + '\n\n' + txt.slice(0,180) + (txt.length>180?'…':'') + '\n\n#FCLACOUR #SaintJoseph #LaReunion';
  if(channel==='YouTube') return 'Titre : ' + post.title + '\nDescription : ' + txt;
  return txt;
}


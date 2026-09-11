function coachLineupExistsForMatch(id){const r=coachLineups?.[id];return Array.isArray(r)?r.length>0:!!(r&&Array.isArray(r.players)&&r.players.length>0&&r.status!=='draft');}

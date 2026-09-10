function kvHtml(pairs){return pairs.map(([k,v])=>`<div>${escapeHtml(k)}</div><div>${fmt(v)}</div>`).join('');}

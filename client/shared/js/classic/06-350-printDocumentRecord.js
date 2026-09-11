function printDocumentRecord(id){
 const d=documentCenterAll().find(x=>x.id===id);if(!d)return;
 const w=window.open('','_blank');
 if(!w)return;
 w.document.write(`<html><head><title>${d.title}</title><style>body{font-family:Arial,sans-serif;padding:24px}.head{display:flex;align-items:center;gap:14px;border-bottom:2px solid #ddd;padding-bottom:12px;margin-bottom:20px}.head img{width:70px;height:70px;object-fit:contain}.small{font-size:12px;color:#555}</style></head><body><div class="head"><img src="${CLUB_LOGO_DATA_URI}" alt="Logo CLUB EXEMPLE"><div><h2 style="margin:0">CLUB EXEMPLE</h2><div class="small">Communication officielle • Ville Exemple</div></div></div><h1>${d.title}</h1><p><strong>Catégorie :</strong> ${d.category}</p><p><strong>Saison :</strong> ${d.season||'—'}</p><p><strong>Référence :</strong> ${d.ref||'—'}</p><p>${d.description||''}</p>
</body></html>`);
 w.document.close();w.print();
}

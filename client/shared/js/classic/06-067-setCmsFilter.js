function setCmsFilter(f,btn){cmsFilter=f;document.querySelectorAll('.cms-tabs button').forEach(b=>b.classList.remove('active'));if(btn)btn.classList.add('active');renderCms()}


(() => {
  const config=window.LEONARDO_PORTFOLIO||{};
  document.querySelectorAll('[data-link="github"]').forEach(el=>el.href=config.github||'https://github.com/LeoCarvalho090');
  document.querySelectorAll('[data-link="studio"]').forEach(el=>el.href=config.studio||'https://vitruno.vitrunostudio.workers.dev/');
  if(config.linkedin){document.querySelectorAll('[data-link="linkedin"]').forEach(el=>{el.href=config.linkedin;el.hidden=false;});}
  if(config.email){document.querySelectorAll('[data-link="email"]').forEach(el=>{el.href='mailto:'+config.email;el.hidden=false;});}
  const projects=window.PROJETOS_PORTFOLIO||[];
  const grid=document.getElementById('project-grid'), result=document.getElementById('results-count');
  const filterButtons=[...document.querySelectorAll('[data-filter]')];
  let active='Todos', search='';
  const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function draw(){
    const selected=projects.filter(p=>(active==='Todos'||p.tag===active)&&(`${p.title} ${p.summary} ${p.tag}`.toLowerCase().includes(search)));
    grid.innerHTML=selected.map((p,i)=>`<article class="project-card" style="--card-delay:${i*45}ms">
      <a class="project-picture ${escapeHtml(p.tone)}" href="projetos/${encodeURIComponent(p.id)}/" target="_blank" rel="noopener" aria-label="Abrir demonstração de ${escapeHtml(p.title)}">
        <img loading="lazy" src="${escapeHtml(p.image)}" alt="Prévia do website ${escapeHtml(p.title)}" width="980" height="600">
        <span class="project-open">Ver website <span aria-hidden="true">↗</span></span>
      </a><div class="project-details"><div class="project-eyebrow"><span>${escapeHtml(p.tag)}</span><span>${escapeHtml(p.variant)}</span></div>
      <h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.summary)}</p><div class="project-bottom"><span>${escapeHtml(p.technology)}</span><a href="projetos/${encodeURIComponent(p.id)}/" target="_blank" rel="noopener" aria-label="Abrir ${escapeHtml(p.title)}"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div></div>
    </article>`).join('');
    if(!selected.length)grid.innerHTML='<div class="empty-state">Nenhum projeto encontrado. Experimente outro termo ou selecione “Todos”.</div>';
    result.textContent=`${selected.length} ${selected.length===1?'projeto':'projetos'} em exibição`;
  }
  filterButtons.forEach(btn=>btn.addEventListener('click',()=>{active=btn.dataset.filter;filterButtons.forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});draw();}));
  const searchInput=document.getElementById('search-projects');
  searchInput?.addEventListener('input',e=>{search=e.target.value.trim().toLowerCase();draw()});
  const toggle=document.getElementById('nav-toggle');const menu=document.getElementById('nav-menu');
  toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));menu.classList.toggle('is-open',!open);});
  document.querySelectorAll('#nav-menu a').forEach(link=>link.addEventListener('click',()=>{toggle?.setAttribute('aria-expanded','false');menu?.classList.remove('is-open');}));
  document.getElementById('year').textContent=new Date().getFullYear();
  draw();
})();

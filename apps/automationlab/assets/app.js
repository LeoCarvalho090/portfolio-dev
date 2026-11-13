import { JOB_TYPES, seedState, validateState, enqueue, beginTask, finishTask, retryTask, interruptRunning, metrics, resultToCsv } from './engine.mjs';

/**
 * Camada de apresentação do AutomationLab.
 * Mantém a interface sincronizada com o estado salvo no navegador e simula
 * as etapas temporais da fila. Validações e cálculos pertencem ao engine.mjs.
 */

(() => {
  const STORE_KEY = 'automationlab:demo:v1';
  const MAX_PARALLEL = 2;
  const qs = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const kindName = type => JOB_TYPES.find(j => j.id===type)?.name || 'Automação';
  const dateTime = value => {try{return new Date(value).toLocaleString('pt-BR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});}catch{return '—'}};
  let state = load();
  let isQueueActive = false;
  let currentFilter = 'all';
  let currentDetail = null;
  let previousFocus = null;
  let toastTimer;
  const timers = new Map();

  function load(){
    try {const value=JSON.parse(localStorage.getItem(STORE_KEY));if(validateState(value)){
      interruptRunning(value);
      localStorage.setItem(STORE_KEY,JSON.stringify(value));
      return value;
    }}catch(error){console.warn('Não foi possível restaurar a demonstração:',error);}
    return seedState();
  }
  function persist(){
    try{localStorage.setItem(STORE_KEY,JSON.stringify(state));}catch(error){
      console.warn('Persistência local indisponível:',error);
      showToast('Sem espaço de armazenamento: os dados podem não persistir.');
    }
  }
  function showToast(message){const el=qs('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3800);}
  function setMessage(message,isError=false){const el=qs('#form-message');el.textContent=message;el.classList.toggle('error',isError);}
  function renderMetrics(){const m=metrics(state);
    qs('#metric-total').textContent=m.total;qs('#metric-completed').textContent=m.completed;
    qs('#metric-queued').textContent=m.queued+m.running;qs('#metric-duplicates').textContent=m.duplicates;
    qs('#tab-all').textContent=m.total;qs('#tab-queued').textContent=m.queued+m.running;
    qs('#tab-completed').textContent=m.completed;qs('#tab-failed').textContent=m.failed;
  }
  const statusLabel={queued:'Na fila',running:'Processando',completed:'Concluída',failed:'Falha simulada',interrupted:'Interrompida'};
  function statusPill(status){return `<span class="status status-${esc(status)}">${esc(statusLabel[status]||status)}</span>`;}
  function renderTasks(){
    const search=qs('#task-search').value.toLowerCase().trim();
    const shown=state.tasks.filter(task=>{
      const statusOK=currentFilter==='all'||(currentFilter==='queued'?['queued','running'].includes(task.status):currentFilter==='failed'?['failed','interrupted'].includes(task.status):task.status===currentFilter);
      return statusOK && `${task.id} ${task.reference} ${kindName(task.type)}`.toLowerCase().includes(search);
    });
    qs('#tasks-body').innerHTML=shown.map(task=>`<tr>
      <td><strong>${esc(task.reference)}</strong><small>${esc(task.id)}</small></td>
      <td>${esc(kindName(task.type))}</td><td>${statusPill(task.status)}</td>
      <td>${task.attempts}</td><td>${esc(dateTime(task.createdAt))}</td>
      <td><button type="button" class="row-action" data-details="${esc(task.id)}" aria-label="Detalhes da tarefa ${esc(task.id)}">Ver detalhes ↗</button></td>
    </tr>`).join('');
    qs('#empty-tasks').hidden=shown.length>0;
    qs('#task-summary').textContent=`Exibindo ${shown.length} de ${state.tasks.length} tarefas`;
    document.querySelectorAll('[data-details]').forEach(button=>button.addEventListener('click',()=>openDetails(button.dataset.details)));
  }
  function renderRunner(){
    const running=state.tasks.filter(t=>t.status==='running');
    const queued=state.tasks.filter(t=>t.status==='queued').length;
    qs('#runner-count').textContent=`${running.length}/${MAX_PARALLEL}`;
    qs('#runner-light').classList.toggle('running',running.length>0);
    qs('#runner-title').textContent=running.length?`${running.length} tarefa${running.length===1?'':'s'} em execução`:(isQueueActive?'Aguardando novas tarefas':'Fila em espera');
    qs('#runner-description').textContent=running.length?`${queued} aguardando na fila`:queued?`${queued} aguardando processamento`:'Tudo em dia por aqui';
    [1,2].forEach((i)=>{const task=running[i-1];qs(`#lane-${i}-title`).textContent=task?task.reference:'Aguardando tarefa';qs(`#lane-${i}-sub`).textContent=task?kindName(task.type):'Slot disponível';qs(`#lane-${i}-end`).textContent=task?'ATIVO':'LIVRE';qs(`#lane-${i}-end`).classList.toggle('busy',!!task);});
    qs('#start-queue').disabled=isQueueActive&&queued===0;
    qs('#pause-queue').disabled=!isQueueActive;
  }
  function renderAudit(){
    const labels={created:'Solicitação criada',started:'Processamento iniciado',completed:'Execução concluída',failed:'Falha controlada',retried:'Retentativa agendada',interrupted:'Execução interrompida',duplicate:'Duplicidade bloqueada'};
    const sym={created:'+',started:'▶',completed:'✓',failed:'!',retried:'↻',interrupted:'Ⅱ',duplicate:'≠'};
    qs('#audit-list').innerHTML=state.audit.slice(0,10).map(ev=>`<li><span class="audit-icon ${esc(ev.kind)}">${esc(sym[ev.kind]||'•')}</span><div class="audit-body"><strong>${esc(labels[ev.kind]||'Evento')} <span style="color:#7890a1">· ${esc(ev.taskId)}</span></strong><p>${esc(ev.description)}</p><time datetime="${esc(ev.at)}">${esc(dateTime(ev.at))}</time></div></li>`).join('') || '<li><span class="audit-icon">•</span><div class="audit-body"><strong>Nenhum evento registrado</strong></div></li>';
  }
  function render(){renderMetrics();renderTasks();renderRunner();renderAudit();}
  function pulseQueue(){
    if(!isQueueActive)return;
    while(timers.size<MAX_PARALLEL){
      const next=state.tasks.filter(t=>t.status==='queued')[0];
      if(!next)break;
      beginTask(state,next.id);
      const taskId=next.id;
      const wait=900+((next.id.charCodeAt(next.id.length-1)%4)*210);
      const timer=setTimeout(()=>{
        timers.delete(taskId);
        finishTask(state,taskId);
        persist();render();
        if(currentDetail===taskId)renderDetail(taskId);
        pulseQueue();
        if(!timers.size&&!state.tasks.some(t=>t.status==='queued')){
          isQueueActive=false;renderRunner();
          showToast('Fila concluída. Consulte os resultados das tarefas.');
        }
      },wait);
      timers.set(taskId,timer);
    }
    persist();render();
    if(!timers.size&&!state.tasks.some(t=>t.status==='queued')){isQueueActive=false;renderRunner();}
  }
  function stopAllTimers(){timers.forEach(timeout=>clearTimeout(timeout));timers.clear();isQueueActive=false;}
  function downloadFile(name,content,mime){const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);}
  function openDetails(id){currentDetail=id;previousFocus=document.activeElement;renderDetail(id);qs('#details-overlay').hidden=false;qs('#close-details').focus();document.body.style.overflow='hidden';}
  function closeDetails(){qs('#details-overlay').hidden=true;document.body.style.overflow='';currentDetail=null;if(previousFocus?.isConnected)previousFocus.focus();}
  function renderDetail(id){
    const task=state.tasks.find(t=>t.id===id);if(!task){closeDetails();return;}
    qs('#details-title').textContent=task.reference;
    const last=task.result;
    const rows=last?.rows||[];
    const resultHtml=last?`<div class="detail-callout"><h3>${esc(last.headline)}</h3><p>${esc(last.summary)}. Todos os registros utilizados são fictícios.</p></div><div class="result-scroll"><table class="result-table"><thead><tr>${last.cols.map(x=>`<th>${esc(x[1])}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${last.cols.map(x=>`<td>${esc(r[x[0]])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:task.error?`<div class="detail-callout detail-warning"><h3>Interrupção controlada</h3><p>${esc(task.error)}</p></div>`:`<div class="detail-placeholder">Ainda não há resultado. Execute a fila para processar esta solicitação.</div>`;
    qs('#details-body').innerHTML=`<div class="detail-grid"><div class="detail-cell"><small>Status</small><strong>${esc(statusLabel[task.status])}</strong></div><div class="detail-cell"><small>Rotina</small><strong>${esc(kindName(task.type))}</strong></div><div class="detail-cell"><small>Tentativas</small><strong>${task.attempts}</strong></div></div>${resultHtml}<p style="font-size:10px;color:#839aad;line-height:1.65;margin:18px 0 0">Chave demonstrativa de deduplicação: <strong>${esc(task.key)}</strong>. Não há envio de e-mails nem alteração de estoque real.</p>`;
    const action=qs('#details-primary');
    action.hidden=!(last||['failed','interrupted'].includes(task.status));
    action.textContent=last?'↓ Baixar CSV':'↻ Tentar novamente';
    action.onclick=()=>{
      if(last){downloadFile(`automationlab-${task.reference.toLowerCase()}.csv`,resultToCsv(last),'text/csv;charset=utf-8');return;}
      if(retryTask(state,id)){
        persist();render();renderDetail(id);showToast('Tarefa retornou à fila com o mesmo ID.');
        if(isQueueActive)pulseQueue();
      }
    };
  }

  qs('#create-form').addEventListener('submit',e=>{
    e.preventDefault();
    const type=qs('#job-type').value,reference=qs('#job-ref').value,failOnce=qs('#simulate-failure').checked;
    try{
      const result=enqueue(state,{type,reference,failOnce});persist();render();
      if(result.duplicate){setMessage(`Duplicidade bloqueada: ${result.task.id} já existe.`,true);showToast('Solicitação repetida bloqueada.');}
      else{setMessage(`${result.task.id} incluída na fila.`);qs('#simulate-failure').checked=false;showToast('Solicitação adicionada. Clique em Executar fila.');if(isQueueActive)pulseQueue();}
    }catch(error){setMessage(String(error.message||error),true);}
  });
  qs('#new-ref').addEventListener('click',()=>{
    const type=qs('#job-type').value.toUpperCase().slice(0,3);
    const n=String(state.seq+1).padStart(2,'0');
    qs('#job-ref').value=`${type}-LOTE-${n}-${Math.random().toString(36).slice(2,5).toUpperCase()}`;
    setMessage('');
  });
  qs('#job-type').addEventListener('change',()=>{qs('#new-ref').click();});
  qs('#start-queue').addEventListener('click',()=>{isQueueActive=true;pulseQueue();});
  qs('#pause-queue').addEventListener('click',()=>{isQueueActive=false;renderRunner();showToast('Fila pausada. Tarefas já iniciadas serão concluídas.');});
  qs('#task-search').addEventListener('input',renderTasks);
  document.querySelectorAll('[data-status]').forEach(btn=>btn.addEventListener('click',()=>{
    currentFilter=btn.dataset.status;document.querySelectorAll('[data-status]').forEach(b=>b.classList.toggle('current',b===btn));renderTasks();
  }));
  qs('#add-examples').addEventListener('click',()=>{
    let count=0;const stamp=Date.now().toString(36).slice(-7).toUpperCase();
    for(const [i,type] of ['stock','orders','report'].entries()){
      if(!enqueue(state,{type,reference:`DEMO-${stamp}-${i+1}`}).duplicate)count++;
    }
    persist();render();showToast(`${count} exemplos criados. Execute a fila!`);if(isQueueActive)pulseQueue();
  });
  qs('#reset-demo').addEventListener('click',()=>{
    if(!window.confirm('Restaurar os dados fictícios iniciais? Todas as suas tarefas e eventos desta demonstração serão substituídos.'))return;
    stopAllTimers();state=seedState();persist();currentFilter='all';qs('#task-search').value='';document.querySelectorAll('[data-status]').forEach(b=>b.classList.toggle('current',b.dataset.status==='all'));if(currentDetail)closeDetails();render();showToast('Demonstração restaurada com dados fictícios.');
  });
  qs('#export-audit').addEventListener('click',()=>downloadFile('automationlab-auditoria.json',JSON.stringify({demo:true,exportadoEm:new Date().toISOString(),eventos:state.audit},null,2),'application/json'));
  qs('#close-details').addEventListener('click',closeDetails);
  qs('#details-close').addEventListener('click',closeDetails);
  qs('#details-overlay').addEventListener('click',e=>{if(e.target===qs('#details-overlay'))closeDetails();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&currentDetail)closeDetails();});
  document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>{
    document.querySelectorAll('.nav a').forEach(l=>l.classList.remove('active'));a.classList.add('active');
  }));
  qs('#year').textContent=String(new Date().getFullYear());
  qs('#new-ref').click();persist();render();
})();

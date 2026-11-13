/**
 * Motor do AutomationLab: regras de negócio, identidade das tarefas e evolução de estados.
 * O cálculo das rotinas é independente da interface; as transições de fila alteram
 * explicitamente o estado recebido. Não há servidor nem concorrência real neste projeto.
 */
export const JOB_TYPES = Object.freeze([
  { id:'stock', name:'Auditoria de estoque', desc:'Identifica itens abaixo do mínimo e disponibilidade', accent:'lime', symbol:'▦' },
  { id:'orders', name:'Validação de pedidos', desc:'Verifica catálogo, quantidade e disponibilidade', accent:'blue', symbol:'◎' },
  { id:'report', name:'Relatório de vendas', desc:'Consolida lançamentos e prepara um CSV', accent:'violet', symbol:'↗' }
]);

export const DATASET = Object.freeze({
  products: [
    {sku:'SKU-1001',name:'Caderno pontilhado',stock:24,reserved:4,min:8,price:29.9},
    {sku:'SKU-1002',name:'Garrafa térmica',stock:10,reserved:7,min:6,price:79.9},
    {sku:'SKU-1003',name:'Caneta gel preta',stock:62,reserved:12,min:15,price:7.9},
    {sku:'SKU-1004',name:'Agenda semanal',stock:6,reserved:3,min:10,price:42},
    {sku:'SKU-1005',name:'Estojo kraft',stock:14,reserved:2,min:8,price:34.5},
    {sku:'SKU-1006',name:'Marcador pastel',stock:9,reserved:6,min:5,price:12.5}
  ],
  orders: [
    {id:'PED-401',customer:'Cliente fictício A',items:[{sku:'SKU-1001',qty:2}]},
    {id:'PED-402',customer:'Cliente fictício B',items:[{sku:'SKU-1002',qty:5}]},
    {id:'PED-403',customer:'Cliente fictício C',items:[{sku:'SKU-1003',qty:4},{sku:'SKU-1005',qty:1}]},
    {id:'PED-404',customer:'Cliente fictício D',items:[{sku:'SKU-9999',qty:1}]},
    {id:'PED-405',customer:'Cliente fictício E',items:[{sku:'SKU-1004',qty:1}]},
    {id:'PED-406',customer:'Cliente fictício F',items:[{sku:'SKU-1006',qty:4}]}
  ],
  sales: [
    {id:'V-601',date:'2026-11-05',channel:'Loja física',total:174.30},
    {id:'V-602',date:'2026-11-06',channel:'Online',total:289.90},
    {id:'V-603',date:'2026-11-07',channel:'Loja física',total:98.00},
    {id:'V-604',date:'2026-11-08',channel:'Online',total:449.50},
    {id:'V-605',date:'2026-11-09',channel:'Marketplace',total:122.40},
    {id:'V-606',date:'2026-11-10',channel:'Online',total:229.00},
    {id:'V-607',date:'2026-11-11',channel:'Loja física',total:139.90}
  ]
});

const VALID_TYPES = new Set(JOB_TYPES.map(x=>x.id));
const STATE_VERSION = 1;
const iso = ()=>new Date().toISOString();

/**
 * Executa uma regra de negócio com dados fornecidos, sem efeitos externos.
 * A interface pode utilizar o resultado para apresentação e exportação em CSV.
 */
export function runOperation(type, data=DATASET){
  if(type==='stock'){
    const rows=data.products.map(p=>({
      sku:p.sku, item:p.name, emEstoque:p.stock, reservados:p.reserved,
      disponiveis:Math.max(0,p.stock-p.reserved), minimo:p.min,
      situacao:Math.max(0,p.stock-p.reserved)<p.min?'Abaixo do mínimo':'Normal'
    }));
    const low=rows.filter(r=>r.situacao==='Abaixo do mínimo');
    return {headline:`${low.length} itens precisam de atenção`,summary:`${rows.length} produtos conferidos · ${low.length} abaixo do estoque mínimo`,rows,
      cols:[['sku','SKU'],['item','Produto'],['disponiveis','Disponível'],['minimo','Mínimo'],['situacao','Situação']]};
  }
  if(type==='orders'){
    const bySku=new Map(data.products.map(p=>[p.sku,p]));
    const rows=data.orders.map(order=>{
      let reason='';
      for(const item of order.items){
        const p=bySku.get(item.sku);
        if(!p){reason=`Item não cadastrado (${item.sku})`;break;}
        if(!Number.isInteger(item.qty)||item.qty<=0){reason='Quantidade inválida';break;}
        if((p.stock-p.reserved)<item.qty){reason=`Saldo insuficiente (${item.sku})`;break;}
      }
      return {pedido:order.id,cliente:order.customer,itens:order.items.length,resultado:reason?'Revisar':'Validado',motivo:reason||'Requisitos atendidos'};
    });
    const approved=rows.filter(r=>r.resultado==='Validado').length;
    return {headline:`${approved} pedidos validados`,summary:`${rows.length} pedidos analisados · ${rows.length-approved} exigem revisão`,rows,
      cols:[['pedido','Pedido'],['cliente','Cliente'],['resultado','Resultado'],['motivo','Motivo']]};
  }
  if(type==='report'){
    const rows=data.sales.map(s=>({...s,total:Math.round(s.total*100)/100}));
    const total=rows.reduce((acc,r)=>acc+Math.round(r.total*100),0)/100;
    const channels={};for(const s of rows) channels[s.channel]=(channels[s.channel]||0)+1;
    return {headline:`R$ ${total.toLocaleString('pt-BR',{minimumFractionDigits:2})} em vendas`,
      summary:`${rows.length} lançamentos consolidados · ${Object.keys(channels).length} canais`,rows,
      cols:[['id','Venda'],['date','Data'],['channel','Canal'],['total','Valor (R$)']]};
  }
  throw new Error('Tipo de automação não reconhecido.');
}
export function resultToCsv(result){
  if(!result?.cols||!Array.isArray(result.rows))throw new Error('Resultado indisponível para CSV');
  const quote=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
  const lines=[result.cols.map(c=>quote(c[1])).join(';'), ...result.rows.map(r=>result.cols.map(c=>quote(r[c[0]])).join(';'))];
  return '\uFEFF'+lines.join('\r\n');
}
export function emptyState(){return {version:STATE_VERSION,seq:0,tasks:[],audit:[],duplicateBlocks:0};}
export function newId(state){return `OP-${String(state.seq+1).padStart(4,'0')}`;}
function addAudit(state,kind,taskId,description){
  state.audit.unshift({id:`EV-${state.seq}-${state.audit.length+1}`,at:iso(),kind,taskId,description});
  state.audit=state.audit.slice(0,120);
}
/**
 * Normaliza tipo + referência e bloqueia duplicidades no estado deste navegador.
 * A tentativa repetida é auditada, mas não cria um novo registro de tarefa.
 */
export function enqueue(state,{type,reference,failOnce=false}){
  if(!VALID_TYPES.has(type))throw new Error('Selecione uma automação válida.');
  const ref=String(reference||'').toUpperCase().trim();
  if(!/^[A-Z0-9][A-Z0-9-_]{2,31}$/.test(ref))throw new Error('Referência: 3 a 32 caracteres (letras, números, - ou _).');
  const key=`${type}:${ref}`;
  const duplicate=state.tasks.find(t=>t.key===key);
  if(duplicate){state.duplicateBlocks++;addAudit(state,'duplicate',duplicate.id,`Solicitação repetida ${ref} bloqueada; nenhum novo trabalho criado.`);return {duplicate:true,task:duplicate};}
  state.seq++;
  const task={id:`OP-${String(state.seq).padStart(4,'0')}`,key,type,reference:ref,status:'queued',attempts:0,failOnce:!!failOnce,createdAt:iso(),updatedAt:iso(),result:null,error:null};
  state.tasks.unshift(task);addAudit(state,'created',task.id,`Solicitação ${ref} adicionada à fila.`);
  return {duplicate:false,task};
}
export function beginTask(state,id){
  const task=state.tasks.find(t=>t.id===id);if(!task||task.status!=='queued')return null;
  task.status='running';task.attempts++;task.updatedAt=iso();task.error=null;
  addAudit(state,'started',task.id,`Execução iniciada · tentativa ${task.attempts}.`);
  return task;
}
/**
 * Finaliza a etapa simulada: registra a falha programada ou calcula um resultado real.
 * A tarefa só é concluída se estiver no estado running.
 */
export function finishTask(state,id){
  const task=state.tasks.find(t=>t.id===id);if(!task||task.status!=='running')return null;
  if(task.failOnce&&task.attempts===1){
    task.status='failed';task.error='Falha simulada na etapa de processamento. É seguro tentar novamente.';
    addAudit(state,'failed',task.id,`Falha controlada na tentativa ${task.attempts}.`);
  }else{
    try{task.result=runOperation(task.type);task.status='completed';task.error=null;
      addAudit(state,'completed',task.id,`Concluída: ${task.result.summary}`);
    }catch(error){task.status='failed';task.error=String(error.message||error);addAudit(state,'failed',task.id,`Erro interno da demonstração: ${task.error}`);}
  }
  task.updatedAt=iso();return task;
}
export function retryTask(state,id){
  const task=state.tasks.find(t=>t.id===id);
  if(!task||!['failed','interrupted'].includes(task.status))return false;
  task.status='queued';task.updatedAt=iso();task.error=null;
  addAudit(state,'retried',task.id,`Retorno à fila mantendo o mesmo identificador ${task.id}.`);
  return true;
}
/**
 * Ao reabrir a página, não presume sucesso de execuções que ficaram em andamento.
 * Esses registros são marcados como interrompidos para possível reenvio manual.
 */
export function interruptRunning(state){
  let changed=false;
  state.tasks.filter(t=>t.status==='running').forEach(t=>{
    t.status='interrupted';t.error='Execução local interrompida. Revise e tente novamente.';t.updatedAt=iso();
    addAudit(state,'interrupted',t.id,'Execução interrompida por fechamento ou recarga da página.');changed=true;
  });return changed;
}
export function seedState(){
  const state=emptyState();
  enqueue(state,{type:'stock',reference:'LOTE-ESTOQUE-01'});
  enqueue(state,{type:'orders',reference:'PEDIDOS-DEMO-01'});
  enqueue(state,{type:'report',reference:'FECHAMENTO-SEMANA-01'});
  enqueue(state,{type:'orders',reference:'PEDIDOS-DEMO-FALHA',failOnce:true});
  beginTask(state,'OP-0001');finishTask(state,'OP-0001');
  beginTask(state,'OP-0003');finishTask(state,'OP-0003');
  beginTask(state,'OP-0004');finishTask(state,'OP-0004');
  return state;
}
export function validateState(value){
  return !!(value && value.version===STATE_VERSION && Array.isArray(value.tasks) && Array.isArray(value.audit) && Number.isInteger(value.seq) && Number.isInteger(value.duplicateBlocks));
}
export function metrics(state){
  const count=status=>state.tasks.filter(t=>t.status===status).length;
  return {total:state.tasks.length,queued:count('queued'),running:count('running'),completed:count('completed'),failed:count('failed')+count('interrupted'),duplicates:state.duplicateBlocks};
}

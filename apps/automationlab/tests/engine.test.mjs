// Os testes exercitam o motor isoladamente, sem navegador ou serviços externos.
// Os cenários usam dados fictícios para verificar resultados e transições de estado.
import test from 'node:test';
import assert from 'node:assert/strict';
import {runOperation,resultToCsv,emptyState,enqueue,beginTask,finishTask,retryTask,interruptRunning,seedState,metrics} from '../assets/engine.mjs';

test('estoque detecta níveis abaixo do mínimo com dados fictícios',()=>{
 const r=runOperation('stock');assert.equal(r.rows.length,6);assert.equal(r.rows.filter(x=>x.situacao==='Abaixo do mínimo').length,3);
});
test('validação de pedidos sinaliza produto desconhecido e insuficiência',()=>{
 const r=runOperation('orders');assert.equal(r.rows.length,6);assert.equal(r.rows.filter(x=>x.resultado==='Revisar').length,3);
});
test('CSV é compatível com Excel pt-BR e aspas escapadas',()=>{
 const csv=resultToCsv(runOperation('report'));assert.ok(csv.startsWith('\uFEFF'));assert.ok(csv.includes('"Valor (R$)"'));assert.ok(csv.includes(';'));
});
test('deduplicação impede criar duas tarefas de mesma automação e referência',()=>{
 const s=emptyState();const a=enqueue(s,{type:'stock',reference:'ABC-01'});const b=enqueue(s,{type:'stock',reference:'abc-01'});
 assert.equal(a.duplicate,false);assert.equal(b.duplicate,true);assert.equal(s.tasks.length,1);assert.equal(s.duplicateBlocks,1);
});
test('mesma referência é válida para tipos diferentes',()=>{
 const s=emptyState();enqueue(s,{type:'stock',reference:'ABC-01'});enqueue(s,{type:'orders',reference:'ABC-01'});assert.equal(s.tasks.length,2);
});
test('falha programada somente na primeira tentativa, e retomada preserva ID',()=>{
 const s=emptyState();const {task}=enqueue(s,{type:'orders',reference:'FAIL-01',failOnce:true});beginTask(s,task.id);finishTask(s,task.id);assert.equal(task.status,'failed');
 assert.equal(retryTask(s,task.id),true);beginTask(s,task.id);finishTask(s,task.id);assert.equal(task.status,'completed');assert.equal(task.attempts,2);assert.equal(s.tasks.length,1);
});
test('recarregar página marca execução como interrompida',()=>{
 const s=emptyState();const {task}=enqueue(s,{type:'stock',reference:'REL-01'});beginTask(s,task.id);interruptRunning(s);assert.equal(task.status,'interrupted');assert.equal(retryTask(s,task.id),true);
});
test('sem inventar sucesso para tarefa não executada',()=>{
 const s=emptyState();const {task}=enqueue(s,{type:'stock',reference:'A-12'});assert.equal(finishTask(s,task.id),null);assert.equal(metrics(s).completed,0);
});
test('estado de demonstração possui concluidas, fila e falha',()=>{
 const s=seedState();assert.equal(metrics(s).total,4);assert.equal(metrics(s).completed,2);assert.equal(metrics(s).failed,1);assert.equal(metrics(s).queued,1);
});

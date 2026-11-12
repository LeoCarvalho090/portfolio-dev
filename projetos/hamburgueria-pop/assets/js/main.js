(() => {
  'use strict';
  const nav = document.querySelector('[data-mobile-nav]');
  const toggle = document.querySelector('[data-menu-toggle]');
  if (nav && toggle) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false');
    }));
  }
  const modal = document.querySelector('#demo-modal');
  const message = document.querySelector('#demo-message');
  const show = (text) => {
    if (!modal) return;
    if (message && text) message.textContent = text;
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
  };
  document.querySelectorAll('[data-demo]').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    show(btn.dataset.demo || 'Este é um modelo de portfólio. O botão será ligado ao WhatsApp real do cliente após a personalização.');
  }));
  document.querySelectorAll('[data-close-demo]').forEach(btn => btn.addEventListener('click', () => {
    if (typeof modal.close === 'function') modal.close(); else modal.removeAttribute('open');
  }));
  modal?.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  window.showDemoMessage = show;
})();

const entries = new Map();
const cartDialog = document.querySelector('#cart-modal');
const itemsHolder = document.querySelector('#cart-items');
const totalLabel = document.querySelector('#cart-total');
const money = new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'});
function count() {return [...entries.values()].reduce((s, item) => s + item.qty, 0);}
function renderCart() {
  const n = count();
  document.querySelectorAll('[data-count]').forEach(el => el.textContent = String(n));
  const total = [...entries.values()].reduce((s,item)=>s + item.qty*item.price, 0);
  totalLabel.textContent = money.format(total);
  itemsHolder.replaceChildren();
  if (!n) {
    const p=document.createElement('p');p.className='empty-cart';p.textContent='Sua sacola está vazia. Escolha um item do cardápio.';itemsHolder.append(p);
  }
  for (const [id,item] of entries) {
    const row=document.createElement('div');row.className='cart-item';
    const label=document.createElement('span');label.textContent=item.label;
    const qty=document.createElement('div');qty.className='cart-qty';
    const minus=document.createElement('button');minus.type='button';minus.textContent='−';minus.setAttribute('aria-label',`Remover um ${item.label}`);
    const number=document.createElement('span');number.textContent=String(item.qty);
    const plus=document.createElement('button');plus.type='button';plus.textContent='+';plus.setAttribute('aria-label',`Adicionar um ${item.label}`);
    minus.addEventListener('click',()=>update(id,-1));plus.addEventListener('click',()=>update(id,+1));
    qty.append(minus,number,plus);row.append(label,qty);itemsHolder.append(row);
  }
}
function update(id,amount,details) {
  const item = entries.get(id) ?? {...details,qty:0};
  item.qty += amount;
  if(item.qty<=0)entries.delete(id);else entries.set(id,item);
  renderCart();
}
document.querySelectorAll('[data-add]').forEach(btn=>btn.addEventListener('click',()=>{
  update(btn.dataset.add,1,{label:btn.dataset.label,price:Number(btn.dataset.price)});
  if (typeof cartDialog.showModal==='function')cartDialog.showModal();
}));
document.querySelectorAll('[data-open-cart]').forEach(btn=>btn.addEventListener('click',()=>cartDialog.showModal()));
document.querySelectorAll('[data-close-cart]').forEach(btn=>btn.addEventListener('click',()=>cartDialog.close()));
cartDialog?.addEventListener('click',e=>{if(e.target===cartDialog)cartDialog.close();});
document.querySelector('#cart-clear')?.addEventListener('click',()=>{entries.clear();renderCart();});
document.querySelector('#cart-checkout')?.addEventListener('click',()=>{
  if(!count()) {window.showDemoMessage('Adicione pelo menos um item antes de simular o pedido.');return;}
  const summary=[...entries.values()].map(x=>`${x.qty}x ${x.label}`).join(', ');
  window.showDemoMessage(`Sua sacola demonstrativa: ${summary}. Total ilustrativo: ${totalLabel.textContent}. Nenhuma compra foi efetuada ou enviada ao WhatsApp.`);
});
renderCart();

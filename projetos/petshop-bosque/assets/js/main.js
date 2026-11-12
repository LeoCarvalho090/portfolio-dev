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

const petButtons = Array.from(document.querySelectorAll('[data-pet-filter]'));
const petCards = Array.from(document.querySelectorAll('[data-pet]'));
petButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.petFilter;
  petButtons.forEach(b => { const active=b===button; b.classList.toggle('active',active); b.setAttribute('aria-pressed',String(active)); });
  petCards.forEach(card => { card.hidden = filter !== 'todos' && !card.dataset.pet.split(' ').includes(filter); });
}));

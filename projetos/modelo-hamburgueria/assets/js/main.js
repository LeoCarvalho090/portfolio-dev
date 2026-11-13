/* Contato externo opcional: o número vazio mantém a experiência em modo demonstrativo.
   As chamadas para ação não enviam mensagens sem uma configuração explícita. */
const WHATSAPP_NUMBER = "";

const menuButton = document.querySelector('[data-menu-button]');
const menu = document.querySelector('[data-menu]');
const demoDialog = document.querySelector('#demo-dialog');
const closeDialog = document.querySelector('[data-close-dialog]');
const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());

function closeMenu() {
  if (!menu || !menuButton) return;
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}
if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });
}

document.querySelectorAll('[data-whatsapp]').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault();
    const number = WHATSAPP_NUMBER.replace(/\D/g, '');
    const message = button.dataset.message || 'Olá! Gostaria de saber mais sobre os serviços.';
    if (number.length >= 12 && number.length <= 15) {
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    } else if (demoDialog && typeof demoDialog.showModal === 'function') {
      demoDialog.showModal();
    } else {
      alert('Este é um website demonstrativo. Nenhuma mensagem é enviada.');
    }
  });
});
if (closeDialog && demoDialog) closeDialog.addEventListener('click', () => demoDialog.close());
if (demoDialog) demoDialog.addEventListener('click', event => {
  if (event.target === demoDialog) demoDialog.close();
});

const revealItems = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach(node => observer.observe(node));
} else {
  revealItems.forEach(node => node.classList.add('is-visible'));
}

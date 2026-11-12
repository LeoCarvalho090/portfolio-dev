(() => {
  'use strict';
  // CONFIGURAÇÃO: depois da venda, substitua pelo número real no formato 55 + DDD + número.
  // Exemplo fictício de formato (NÃO use este número): '5511999999999'.
  const WHATSAPP_NUMBER = '';
  const BUSINESS_NAME = 'Sua Academia';
  const navigation = document.getElementById('site-nav');
  const menuButton = document.querySelector('.menu-toggle');
  const toast = document.getElementById('toast');
  const toastClose = document.querySelector('.toast-close');
  let closeTimer;

  document.getElementById('year').textContent = new Date().getFullYear();

  menuButton?.addEventListener('click', () => {
    const next = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(next));
    menuButton.setAttribute('aria-label', next ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
    navigation.classList.toggle('open', next);
  });
  navigation?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu de navegação');
  }));

  function hideToast() {
    toast?.classList.remove('visible');
    clearTimeout(closeTimer);
  }
  function showToast() {
    if (!toast) return;
    clearTimeout(closeTimer);
    toast.classList.add('visible');
    closeTimer = setTimeout(hideToast, 6000);
  }
  toastClose?.addEventListener('click', hideToast);
  document.querySelectorAll('.js-whatsapp').forEach(btn => {
    btn.addEventListener('click', () => {
      const subject = btn.dataset.subject || 'informações sobre a academia';
      if (!/^\d{12,13}$/.test(WHATSAPP_NUMBER)) {
        showToast();
        return;
      }
      const text = `Olá! Vi o site da ${BUSINESS_NAME} e gostaria de saber mais sobre ${subject}.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      hideToast();
      navigation?.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
    }
  });
})();

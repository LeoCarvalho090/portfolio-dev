/* =======================================================
  CONFIGURAÇÃO RÁPIDA PARA CADA CLIENTE
  - Use apenas números no telefone: DDI + DDD + número.
  - Exemplo de formato (NÃO use este número): 5511999999999.
  - Deixe whatsappNumber vazio para ativar o modo demonstração.
  - O modelo é conceitual; preços, horários e descrições são ilustrativos.
======================================================= */
const SITE_CONFIG = {
  businessName: 'SUA',
  city: 'São Paulo — SP',
  whatsappNumber: '', // Ex.: '55' + DDD + número REAL do cliente
  messagePrefix: 'Olá! Vi o site da Sua Barbearia e gostaria de agendar',
};

document.querySelectorAll('[data-brand]').forEach((element) => {
  element.textContent = SITE_CONFIG.businessName;
});
const locationElement = document.querySelector('[data-location]');
if (locationElement) locationElement.textContent = SITE_CONFIG.city;

document.getElementById('year').textContent = new Date().getFullYear();

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navigation.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}));

// Se o navegador não conseguir baixar as fotos de exemplo, o desenho local aparece.
document.querySelectorAll('img.photo-image').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
});

const toast = document.getElementById('demo-toast');
let toastTimeout;
function showDemoToast() {
  toast.textContent = 'Este é um site de demonstração. Ao cadastrar o WhatsApp real do cliente no arquivo script.js, este botão abrirá uma conversa com a mensagem de agendamento preenchida.';
  toast.classList.add('is-visible');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 6500);
}

function openWhatsapp(service) {
  const number = SITE_CONFIG.whatsappNumber.replace(/\D/g, '');
  if (!/^\d{12,15}$/.test(number)) {
    showDemoToast();
    return;
  }
  const message = `${SITE_CONFIG.messagePrefix} ${service}. Pode me informar os horários disponíveis?`;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
document.querySelectorAll('.whatsapp-trigger').forEach(button => {
  button.addEventListener('click', () => openWhatsapp(button.dataset.service || 'um horário'));
});

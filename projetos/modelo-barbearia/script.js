/* =======================================================
  Configuração da interface demonstrativa.
  A ausência de número de WhatsApp impede contatos externos acidentais.
  O código mantém separados os dados de apresentação e as ações de navegação.
======================================================= */
const SITE_CONFIG = {
  businessName: 'SUA',
  city: 'São Paulo — SP',
  whatsappNumber: '', // Sem número configurado: fluxo demonstrativo, sem contato externo
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

// Preserva a apresentação da página quando uma fotografia externa não carrega.
document.querySelectorAll('img.photo-image').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
});

const toast = document.getElementById('demo-toast');
let toastTimeout;
function showDemoToast() {
  toast.textContent = 'Este é um website demonstrativo. Nenhum agendamento ou mensagem é enviado.';
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

const track = document.querySelector('.cases-track');
const cards = [...document.querySelectorAll('.case-card')];
const counter = document.querySelector('.case-counter');
const dialog = document.querySelector('.case-dialog');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeCase = 0;
let opener;
const stepSize = () => cards[0].getBoundingClientRect().width + 24;
function updateCounter() {
  if (counter && track && cards.length) counter.textContent = `${Math.min(cards.length - 1, Math.round(track.scrollLeft / stepSize())) + 1} из ${cards.length}`;
}
function showCase(index) {
  activeCase = (index + cards.length) % cards.length;
  const card = cards[activeCase];
  const header = card.querySelector('.case-header').cloneNode(true);
  header.querySelector('h3').id = 'case-dialog-title';
  dialog.querySelector('.case-dialog-body').replaceChildren(header, card.querySelector('.case-content').cloneNode(true));
  dialog.scrollTop = 0;
  dialog.querySelector('.dialog-counter').textContent = `${activeCase + 1} из ${cards.length}`;
}
if (track && cards.length && dialog && typeof dialog.showModal === 'function') {
  document.documentElement.classList.add('cases-ready');
  cards.forEach((card, index) => {
    const button = card.querySelector('.case-open');
    button.setAttribute('aria-label', `Открыть кейс: ${card.querySelector('h3').textContent}`);
    button.addEventListener('click', () => {
      opener = button; showCase(index); dialog.showModal();
      document.body.classList.add('case-modal-open');
      dialog.querySelector('.case-dialog-close').focus();
    });
  });
  track.addEventListener('scroll', updateCounter, {passive: true});
  window.addEventListener('resize', updateCounter);
  document.querySelectorAll('[data-cases-step]').forEach(button => button.addEventListener('click', () => {
    const current = Math.min(cards.length - 1, Math.round(track.scrollLeft / stepSize()));
    const next = (current + Number(button.dataset.casesStep) + cards.length) % cards.length;
    track.scrollTo({left: next * stepSize(), behavior: reduceMotion.matches ? 'instant' : 'smooth'});
  }));
  dialog.querySelector('.case-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('case-modal-open'); opener?.focus({preventScroll:true}); });
  dialog.querySelectorAll('[data-dialog-step]').forEach(button => button.addEventListener('click', () => showCase(activeCase + Number(button.dataset.dialogStep))));
  updateCounter();
}
const motionToggle = document.querySelector('.motion-toggle');
motionToggle?.addEventListener('click', () => {
  const paused = document.documentElement.classList.toggle('motion-paused');
  motionToggle.setAttribute('aria-pressed', String(paused));
  motionToggle.textContent = paused ? 'Включить анимацию' : 'Остановить анимацию';
});

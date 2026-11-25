const track = document.querySelector('.cases-track');
const counter = document.querySelector('.case-counter');
const cards = [...document.querySelectorAll('.case-card')];
const updateCaseCounter = () => {
  if (!track || !cards.length || !counter) return;
  const step = cards[0].getBoundingClientRect().width + 24;
  counter.textContent = `${Math.min(cards.length, Math.round(track.scrollLeft / step) + 1)} из ${cards.length}`;
};
track?.addEventListener('scroll', updateCaseCounter, {passive: true});
document.querySelectorAll('[data-cases-step]').forEach(button => {
  button.addEventListener('click', () => {
    const track = document.querySelector('.cases-track');
    const card = track?.querySelector('.case-card');
    if (!track || !card) return;
    track.scrollBy({left: Number(button.dataset.casesStep) * (card.getBoundingClientRect().width + 24), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
});

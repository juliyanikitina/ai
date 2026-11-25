document.querySelectorAll('[data-cases-step]').forEach(button => {
  button.addEventListener('click', () => {
    const track = document.querySelector('.cases-track');
    const card = track?.querySelector('.case-card');
    if (!track || !card) return;
    track.scrollBy({left: Number(button.dataset.casesStep) * (card.getBoundingClientRect().width + 24), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
});

/* Progressive enhancement: native Navigation owns the mobile menu. */
(() => {
  document.querySelectorAll('.wp-block-query.is-style-lakehub-insights').forEach((query) => {
    const track = query.querySelector('.wp-block-post-template');
    if (!track) return;
    const controls = document.createElement('div');
    controls.className = 'lakehub-insights-controls';
    const buttons = [-1, 1].map((direction) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = direction < 0 ? '←' : '→';
      button.setAttribute('aria-label', direction < 0 ? 'Previous insights' : 'Next insights');
      button.addEventListener('click', () => {
        const card = track.querySelector('li');
        track.scrollBy({left: direction * (card ? card.getBoundingClientRect().width + 24 : track.clientWidth), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      });
      controls.append(button);
      return button;
    });
    const update = () => {
      buttons[0].disabled = track.scrollLeft <= 1;
      buttons[1].disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
    };
    query.append(controls);
    track.addEventListener('scroll', update, {passive:true});
    new ResizeObserver(update).observe(track);
    update();
  });
})();

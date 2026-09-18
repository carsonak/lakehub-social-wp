/**
 * Insights Query Carousel and Arrow Bounce interactions.
 *
 * @package LakeHub_Social
 */

(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.wp-block-query.is-style-lakehub-insights').forEach((query) => {
    const track = query.querySelector('.wp-block-post-template');
    const cards = track ? Array.from(track.children) : [];
    if (!cards.length) return;
    query.classList.add('is-enhanced');
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    track.setAttribute('aria-label', 'Latest Insights. Use Left and Right arrow keys to browse.');
    let selected = innerWidth > 600 && cards.length > 1 ? 1 : 0;
    let target = null;
    let settleTimer;
    const controls = document.createElement('div');
    controls.className = 'lakehub-insights-controls';
    const status = document.createElement('p');
    status.className = 'screen-reader-text';
    status.setAttribute('aria-live', 'polite');
    const buttons = [-1, 1].map((direction) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = direction < 0 ? '‹' : '›';
      button.setAttribute('aria-label', direction < 0 ? 'Previous insight' : 'Next insight');
      button.addEventListener('click', () => go((target ?? selected) + direction));
      controls.append(button);
      return button;
    });
    const update = () => {
      cards.forEach((card, index) => card.classList.toggle('is-current', index === selected));
      buttons.forEach((button, index) => {
        const hidden = index === 0 ? selected === 0 : selected === cards.length - 1;
        if (hidden && document.activeElement === button) track.focus({preventScroll: true});
        button.hidden = hidden;
      });
      status.textContent = `Insight ${selected + 1} of ${cards.length}`;
    };
    const center = (index, behavior) => {
      const card = cards[index];
      track.scrollTo({left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2, behavior});
    };
    const go = (index) => {
      target = Math.max(0, Math.min(cards.length - 1, index));
      selected = target;
      update();
      center(selected, reducedMotion.matches ? 'instant' : 'smooth');
    };
    track.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      go(event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : (target ?? selected) + (event.key === 'ArrowLeft' ? -1 : 1));
    });
    const settle = () => {
      if (target !== null) {
        const destination = cards[target].offsetLeft + cards[target].offsetWidth / 2 - track.clientWidth / 2;
        if (Math.abs(track.scrollLeft - destination) > 2) return;
      }
      target = null;
      const middle = track.scrollLeft + track.clientWidth / 2;
      selected = cards.reduce((best, card, index) => Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle) < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - middle) ? index : best, 0);
      update();
    };
    track.addEventListener('scroll', () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 160);
    }, {passive: true});
    track.addEventListener('scrollend', settle);
    track.addEventListener('pointerdown', () => { target = null; }, {passive: true});
    track.addEventListener('wheel', () => { target = null; }, {passive: true});
    track.addEventListener('focusin', (event) => {
      const index = cards.findIndex(card => card.contains(event.target));
      if (index >= 0 && index !== selected) go(index);
    });
    query.append(controls, status);
    new ResizeObserver(() => { center(selected, 'instant'); update(); }).observe(track);
    update();
    requestAnimationFrame(() => center(selected, 'instant'));
  });

  // Latest Insights arrow bounce interaction
  const arrowButtons = document.querySelectorAll('.is-style-lakehub-insight-copy .wp-block-read-more');
  arrowButtons.forEach((btn) => {
    btn.addEventListener('pointerenter', () => {
      btn.classList.remove('is-arrow-animating');
      void btn.offsetWidth;
      btn.classList.add('is-arrow-animating');
    });

    btn.addEventListener('animationend', () => {
      btn.classList.remove('is-arrow-animating');
    });
  });
})();

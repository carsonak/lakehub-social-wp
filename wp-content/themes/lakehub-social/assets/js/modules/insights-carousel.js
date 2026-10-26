/** Latest Insights browsing and arrow feedback. @package LakeHub_Social */
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
    const visibleCount = () => Math.min(cards.length, Number(getComputedStyle(track).getPropertyValue('--lakehub-insight-columns')) || 1);
    const last = () => Math.max(0, cards.length - visibleCount());
    const step = () => cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
    let first = 0;
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
      button.addEventListener('click', () => go(first + direction));
      controls.append(button);
      return button;
    });
    const update = () => {
      cards.forEach((card, index) => card.classList.toggle('is-current', index === first + Math.floor((visibleCount() - 1) / 2)));
      buttons[0].disabled = first === 0;
      buttons[1].disabled = first === last();
      controls.hidden = cards.length <= visibleCount();
      status.textContent = `Insights ${first + 1} to ${Math.min(cards.length, first + visibleCount())} of ${cards.length}`;
    };
    const go = (index, behavior = reducedMotion.matches ? 'instant' : 'smooth') => {
      first = Math.max(0, Math.min(last(), index));
      update();
      track.scrollTo({ left: first * step(), behavior });
    };
    track.addEventListener('keydown', (event) => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      go(event.key === 'Home' ? 0 : event.key === 'End' ? last() : first + (event.key === 'ArrowLeft' ? -1 : 1));
    });
    const settle = () => {
      first = Math.max(0, Math.min(last(), Math.round(track.scrollLeft / step())));
      update();
    };
    track.addEventListener('scroll', () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 160);
    }, { passive: true });
    track.addEventListener('scrollend', settle);
    track.addEventListener('focusin', (event) => {
      const index = cards.findIndex((card) => card.contains(event.target));
      if (index >= 0 && (index < first || index >= first + visibleCount())) go(index < first ? index : index - visibleCount() + 1);
    });
    query.append(controls, status);
    new ResizeObserver(() => go(first, 'instant')).observe(track);
    update();
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

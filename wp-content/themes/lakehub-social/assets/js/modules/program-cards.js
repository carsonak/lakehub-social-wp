/**
 * Program cards scroll visibility and mouse glare interactions.
 *
 * @package LakeHub_Social
 */

(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hoverPointer = matchMedia('(hover: hover) and (pointer: fine)');
  const programCards = Array.from(document.querySelectorAll('.lakehub-program'));

  if (!programCards.length) return;

  if (!reducedMotion.matches) {
    let bounds = [];
    let frame = 0;
    const measure = () => {
      bounds = programCards.map((card) => {
        let top = 0;
        let el = card;
        while (el) {
          top += el.offsetTop || 0;
          el = el.offsetParent;
        }
        return { card, top, height: card.offsetHeight };
      });
    };
    const updateCards = () => {
      frame = 0;
      const scrollY = window.scrollY;
      const adminBottom = Math.max(0, document.getElementById('wpadminbar')?.getBoundingClientRect().bottom || 0);
      const headerClearance = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lakehub-header-clearance')) || (adminBottom + 80);
      const viewHeight = Math.max(200, window.innerHeight - headerClearance);

      bounds.forEach(({ card, top, height }) => {
        if (card.contains(document.activeElement)) {
          card.classList.remove('is-card-above', 'is-card-below');
          card.classList.add('is-card-visible');
          return;
        }
        const threshold = height * (1 / 3);
        const cardTopInView = top - scrollY - headerClearance;
        const cardBottomInView = cardTopInView + height;

        if (cardBottomInView < threshold) {
          card.classList.remove('is-card-visible', 'is-card-below');
          card.classList.add('is-card-above');
        } else if (cardTopInView > viewHeight - threshold) {
          card.classList.remove('is-card-visible', 'is-card-above');
          card.classList.add('is-card-below');
        } else {
          card.classList.remove('is-card-above', 'is-card-below');
          card.classList.add('is-card-visible');
        }
      });
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateCards);
    };

    programCards.forEach((card) => {
      card.classList.add('is-card-ready');
      card.addEventListener('focusin', scheduleUpdate);
      card.addEventListener('focusout', scheduleUpdate);
    });

    measure();
    updateCards();

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', () => { measure(); scheduleUpdate(); }, { passive: true });
    new ResizeObserver(() => { measure(); scheduleUpdate(); }).observe(document.body);

    reducedMotion.addEventListener('change', (event) => {
      if (event.matches) {
        programCards.forEach((card) => {
          card.classList.remove('is-card-above', 'is-card-below', 'is-card-ready');
          card.classList.add('is-card-visible');
        });
      } else {
        programCards.forEach((card) => card.classList.add('is-card-ready'));
        measure();
        updateCards();
      }
    });
  }

  programCards.forEach((card) => {
    let frame = 0;
    let point;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      card.classList.remove('has-glare');
    };
    card.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches || !hoverPointer.matches || event.pointerType === 'touch') return;
      point = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--lakehub-glare-x', `${(point.x - bounds.left) / bounds.width * 100}%`);
        card.style.setProperty('--lakehub-glare-y', `${(point.y - bounds.top) / bounds.height * 100}%`);
        card.classList.add('has-glare');
      });
    });
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
    reducedMotion.addEventListener('change', reset);
    hoverPointer.addEventListener('change', reset);
  });
})();

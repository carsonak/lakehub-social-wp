/**
 * Transformation circular cards proximity and scroll interactions.
 *
 * @package LakeHub_Social
 */

(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.is-style-lakehub-transformation-grid').forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll('.is-style-lakehub-transformation-card'));
    if (!cards.length) return;

    let rafId = 0;
    let activePointer = null;

    const resetAll = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
      cards.forEach((card) => {
        card.style.setProperty('--lakehub-circle-scale', '1');
        card.style.setProperty('--lakehub-circle-opacity', '1');
        card.style.setProperty('--lakehub-circle-z', '1');
        card.style.setProperty('--lakehub-circle-text', '#ffffff');
      });
    };

    const isMobile = () => window.innerWidth <= 900;

    const updateDesktopProximity = (px, py) => {
      if (reducedMotion.matches) {
        resetAll();
        return;
      }

      const cardData = cards.map((card, idx) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(px - cx, py - cy);
        return { card, idx, dist, width: rect.width };
      });

      cardData.sort((a, b) => a.dist - b.dist);
      const sigma = (cardData[0].width || 300) * 0.6;

      cardData.forEach((item, rank) => {
        const factor = Math.exp(-Math.pow(item.dist / sigma, 2));
        const scale = 1 + 0.05 * factor;
        const opacity = 0.85 + 0.15 * factor;
        const zIndex = 10 - rank;
        const textColor = factor > 0.6 ? '#ffffff' : (factor < 0.2 ? '#e4e2e2' : '#f0efef');

        item.card.style.setProperty('--lakehub-circle-scale', scale.toFixed(3));
        item.card.style.setProperty('--lakehub-circle-opacity', opacity.toFixed(3));
        item.card.style.setProperty('--lakehub-circle-z', `${zIndex}`);
        item.card.style.setProperty('--lakehub-circle-text', textColor);
      });
    };

    const updateMobileScroll = () => {
      if (reducedMotion.matches) {
        resetAll();
        return;
      }

      const gridRect = grid.getBoundingClientRect();
      const vh = window.innerHeight;
      const vCenter = vh / 2;

      if (gridRect.bottom < 0 || gridRect.top > vh) {
        resetAll();
        return;
      }

      const cardData = cards.map((card, idx) => {
        const rect = card.getBoundingClientRect();
        const cy = rect.top + rect.height / 2;
        const dist = Math.abs(cy - vCenter);
        return { card, idx, dist };
      });

      cardData.sort((a, b) => a.dist - b.dist);
      const sigma = vh * 0.25;

      cardData.forEach((item, rank) => {
        const factor = Math.exp(-Math.pow(item.dist / sigma, 2));
        const scale = 1 + 0.05 * factor;
        const opacity = 0.85 + 0.15 * factor;
        const zIndex = 10 - rank;
        const textColor = factor > 0.6 ? '#ffffff' : (factor < 0.2 ? '#e4e2e2' : '#f0efef');

        item.card.style.setProperty('--lakehub-circle-scale', scale.toFixed(3));
        item.card.style.setProperty('--lakehub-circle-opacity', opacity.toFixed(3));
        item.card.style.setProperty('--lakehub-circle-z', `${zIndex}`);
        item.card.style.setProperty('--lakehub-circle-text', textColor);
      });
    };

    grid.addEventListener('pointermove', (event) => {
      if (isMobile() || reducedMotion.matches || event.pointerType === 'touch') return;
      activePointer = { x: event.clientX, y: event.clientY };
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          if (activePointer) updateDesktopProximity(activePointer.x, activePointer.y);
        });
      }
    });

    grid.addEventListener('pointerleave', () => {
      if (isMobile()) return;
      activePointer = null;
      resetAll();
    });

    grid.addEventListener('pointercancel', () => {
      if (isMobile()) return;
      activePointer = null;
      resetAll();
    });

    const onScroll = () => {
      if (!isMobile() || reducedMotion.matches) return;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          updateMobileScroll();
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      if (isMobile()) {
        updateMobileScroll();
      } else {
        resetAll();
      }
    }, { passive: true });

    window.addEventListener('blur', resetAll);
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {
        resetAll();
      } else if (isMobile()) {
        updateMobileScroll();
      }
    });

    if (isMobile() && !reducedMotion.matches) {
      updateMobileScroll();
    }
  });
})();

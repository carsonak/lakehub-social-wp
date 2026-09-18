/**
 * Halftone photograph hover repulsion effect.
 *
 * @package LakeHub_Social
 */

(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hoverPointer = matchMedia('(hover: hover) and (pointer: fine)');
  const halftoneTargets = Array.from(document.querySelectorAll('.is-style-lakehub-story-photo, .is-style-lakehub-community-photo, .is-style-lakehub-portfolio-photo'));

  if (!halftoneTargets.length) return;

  halftoneTargets.forEach((target) => {
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      target.style.setProperty('--lakehub-repel-x', '0px');
      target.style.setProperty('--lakehub-repel-y', '0px');
    };

    target.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches || !hoverPointer.matches || event.pointerType === 'touch') return;
      const px = event.clientX;
      const py = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = target.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - px;
        const dy = cy - py;
        const dist = Math.hypot(dx, dy);
        if (dist === 0) {
          target.style.setProperty('--lakehub-repel-x', '0px');
          target.style.setProperty('--lakehub-repel-y', '0px');
          return;
        }
        const maxCap = parseFloat(getComputedStyle(target).getPropertyValue('--lakehub-dot-spacing')) || 36;
        const radius = Math.max(rect.width, rect.height) / 2 || 1;
        const norm = Math.min(1, dist / radius);
        const factor = norm * (2 - norm);
        const displacement = factor * maxCap;
        const repelX = (dx / dist) * displacement;
        const repelY = (dy / dist) * displacement;
        target.style.setProperty('--lakehub-repel-x', `${repelX.toFixed(2)}px`);
        target.style.setProperty('--lakehub-repel-y', `${repelY.toFixed(2)}px`);
      });
    });

    target.addEventListener('pointerleave', reset);
    target.addEventListener('pointercancel', reset);
    window.addEventListener('blur', reset);
    reducedMotion.addEventListener('change', reset);
    hoverPointer.addEventListener('change', reset);
  });
})();

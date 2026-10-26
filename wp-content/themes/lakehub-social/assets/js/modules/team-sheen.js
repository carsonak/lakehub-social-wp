/** A lightweight pointer-following highlight; card content remains interactive. @package LakeHub_Social */
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.lakehub-team-card').forEach((card) => {
    let frame = 0;
    let point = null;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      point = null;
      card.classList.remove('has-sheen');
      card.style.removeProperty('--lakehub-sheen-x');
      card.style.removeProperty('--lakehub-sheen-y');
    };
    card.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
      point = { x: event.clientX, y: event.clientY };
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!point) return;
        const rect = card.getBoundingClientRect();
        const clamp = (value) => Math.max(0, Math.min(100, value));
        card.style.setProperty('--lakehub-sheen-x', `${clamp((point.x - rect.left) / rect.width * 100)}%`);
        card.style.setProperty('--lakehub-sheen-y', `${clamp((point.y - rect.top) / rect.height * 100)}%`);
        card.classList.add('has-sheen');
      });
    });
    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
    reducedMotion.addEventListener('change', reset);
    finePointer.addEventListener('change', reset);
  });
})();

/**
 * Journey timeline keyboard and scroll interactions.
 *
 * @package LakeHub_Social
 */

(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.is-style-lakehub-timeline').forEach((track) => {
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    track.setAttribute('aria-label', 'Our journey. Use Left and Right arrow keys to explore milestones.');
    let pointer = null;
    let suppressClick = false;
    track.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || !event.isPrimary || event.button !== 0 || track.scrollWidth <= track.clientWidth) return;
      pointer = { id: event.pointerId, x: event.clientX, left: track.scrollLeft, dragging: false };
    });
    track.addEventListener('pointermove', (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      if (!pointer.dragging && Math.abs(event.clientX - pointer.x) < 6) return;
      if (!pointer.dragging) {
        pointer.dragging = true;
        track.setPointerCapture(event.pointerId);
        track.classList.add('is-dragging');
      }
      event.preventDefault();
      track.scrollLeft = pointer.left + pointer.x - event.clientX;
    });
    const finish = (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      suppressClick = pointer.dragging;
      pointer = null;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
      setTimeout(() => { suppressClick = false; }, 0);
    };
    window.addEventListener('pointerup', finish);
    track.addEventListener('pointercancel', finish);
    track.addEventListener('lostpointercapture', finish);
    track.addEventListener('click', (event) => {
      if (suppressClick) { event.preventDefault(); event.stopPropagation(); }
    }, true);
    track.addEventListener('dragstart', (event) => event.preventDefault());
    track.addEventListener('keydown', (event) => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      track.scrollBy({
        left: (event.key === 'ArrowLeft' ? -1 : 1) * (track.firstElementChild.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0)),
        behavior: reducedMotion.matches ? 'instant' : 'smooth'
      });
    });
  });
})();

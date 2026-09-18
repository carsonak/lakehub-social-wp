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
    track.addEventListener('keydown', (event) => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      track.scrollBy({
        left: (event.key === 'ArrowLeft' ? -1 : 1) * (track.firstElementChild.getBoundingClientRect().width + 32),
        behavior: reducedMotion.matches ? 'instant' : 'smooth'
      });
    });
  });
})();

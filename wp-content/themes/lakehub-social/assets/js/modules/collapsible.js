/**
 * Collapsible text sections ("Read More" / "Hide" accordion toggles).
 *
 * @package LakeHub_Social
 */

(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.is-style-lakehub-story-copy, [data-lakehub-collapsible]').forEach((container) => {
    const paragraphs = Array.from(container.querySelectorAll(':scope > p'));
    if (paragraphs.length <= 1) return;
    if (container.querySelector('.lakehub-collapsible-drawer')) return;

    const drawer = document.createElement('div');
    drawer.className = 'lakehub-collapsible-drawer is-collapsed';
    drawer.setAttribute('aria-expanded', 'false');

    const downChevronSvg = '<svg class="lakehub-toggle-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 9 12 16 19 9"></polyline></svg>';
    const upChevronSvg = '<svg class="lakehub-toggle-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 15 12 8 19 15"></polyline></svg>';

    paragraphs[0].after(drawer);

    for (let i = 1; i < paragraphs.length; i++) {
      drawer.appendChild(paragraphs[i]);
    }

    const readMoreBtn = document.createElement('button');
    readMoreBtn.type = 'button';
    readMoreBtn.className = 'lakehub-text-toggle-btn lakehub-btn-read-more';
    readMoreBtn.innerHTML = `<span>Read More</span> ${downChevronSvg}`;
    readMoreBtn.setAttribute('aria-label', 'Read more');
    drawer.after(readMoreBtn);

    const hideBtn = document.createElement('button');
    hideBtn.type = 'button';
    hideBtn.className = 'lakehub-text-toggle-btn lakehub-btn-hide';
    hideBtn.innerHTML = `<span>Hide</span> ${upChevronSvg}`;
    hideBtn.setAttribute('aria-label', 'Hide text');
    drawer.appendChild(hideBtn);

    const expand = () => {
      const fullHeight = drawer.scrollHeight;
      drawer.style.setProperty('--lakehub-drawer-full-height', `${fullHeight + 48}px`);
      drawer.classList.remove('is-collapsed');
      drawer.classList.add('is-expanded');
      drawer.setAttribute('aria-expanded', 'true');
      readMoreBtn.classList.add('is-hidden');
      readMoreBtn.style.setProperty('display', 'none', 'important');
      try {
        hideBtn.focus({ preventScroll: true });
      } catch (_) {
        hideBtn.focus();
      }
    };

    const collapse = () => {
      drawer.classList.remove('is-expanded');
      drawer.classList.add('is-collapsed');
      drawer.setAttribute('aria-expanded', 'false');
      readMoreBtn.classList.remove('is-hidden');
      readMoreBtn.style.removeProperty('display');
      try {
        readMoreBtn.focus({ preventScroll: true });
      } catch (_) {
        readMoreBtn.focus();
      }
      const topOffset = container.getBoundingClientRect().top + window.scrollY - 120;
      if (window.scrollY > topOffset) {
        window.scrollTo({ top: topOffset, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      }
    };

    readMoreBtn.addEventListener('click', expand);
    hideBtn.addEventListener('click', collapse);
  });
})();

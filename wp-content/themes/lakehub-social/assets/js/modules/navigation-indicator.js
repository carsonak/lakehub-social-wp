/** One desktop navigation indicator shared by pointer and keyboard focus. @package LakeHub_Social */
(() => {
  document.querySelectorAll('.is-style-lakehub-header .wp-block-navigation').forEach((nav) => {
    const list = nav.querySelector('.wp-block-navigation__container');
    if (!list) return;
    const links = Array.from(list.querySelectorAll(':scope > .wp-block-navigation-item > a'));
    if (!links.length) return;
    const desktop = matchMedia('(min-width: 600px)');
    const indicator = document.createElement('span');
    indicator.className = 'lakehub-nav-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    nav.append(indicator);
    nav.classList.add('has-moving-indicator');
    let pointerLink = null;
    let frame = 0;
    const current = () => links.find((link) => link.getAttribute('aria-current') === 'page' || link.parentElement.classList.contains('current-menu-item'));
    const update = () => {
      frame = 0;
      const focused = links.find((link) => link === document.activeElement);
      const target = focused || pointerLink || current();
      links.forEach((link) => link.classList.toggle('is-nav-highlighted', link === target));
      indicator.hidden = !desktop.matches || !target || !!nav.querySelector('.is-menu-open');
      if (indicator.hidden) return;
      const rect = target.getBoundingClientRect();
      const parent = nav.getBoundingClientRect();
      indicator.style.width = `${rect.width}px`;
      indicator.style.transform = `translateX(${rect.left - parent.left}px)`;
      // Use the resting link baseline, independent of its animated text lift.
      indicator.style.top = `${list.offsetTop + list.offsetHeight - 2}px`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    nav.addEventListener('pointermove', (event) => {
      if (!desktop.matches || event.pointerType === 'touch') return;
      pointerLink = links.reduce((nearest, link) => {
        const distance = (item) => { const r = item.getBoundingClientRect(); return Math.abs(event.clientX - (r.left + r.width / 2)); };
        return distance(link) < distance(nearest) ? link : nearest;
      }, links[0]);
      schedule();
    });
    nav.addEventListener('pointerleave', () => { pointerLink = null; schedule(); });
    nav.addEventListener('focusin', schedule);
    nav.addEventListener('focusout', schedule);
    desktop.addEventListener('change', () => { pointerLink = null; schedule(); });
    new ResizeObserver(schedule).observe(nav);
    new MutationObserver(schedule).observe(nav, { subtree: true, attributes: true, attributeFilter: ['aria-expanded', 'aria-current'] });
    document.fonts?.ready.then(schedule);
    window.addEventListener('pageshow', schedule);
    update();
  });
})();

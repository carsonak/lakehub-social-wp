/**
 * LakeHub Social - Global site behaviors.
 *
 * Handles sticky navbar footprint/hide-on-scroll, newsletter submission feedback,
 * and security attributes for external links. Feature-specific interactions are
 * modularised in assets/js/modules/.
 *
 * @package LakeHub_Social
 */

(() => {
  // The template part owns the sticky footprint; native Navigation still owns its menu.
  const navbar = document.querySelector('.wp-site-blocks > header:has(.is-style-lakehub-header)');
  if (navbar) {
    let lastY = Math.max(0, window.scrollY);
    let travel = 0;
    let frame = 0;
    const pinned = () => navbar.contains(document.activeElement) || navbar.querySelector('.is-menu-open');
    const show = () => {
      if (navbar.classList.contains('is-navbar-hidden')) {
        navbar.classList.remove('is-navbar-hidden');
      }
      travel = 0;
    };
    const updateNavbar = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const adminBottom = Math.max(0, document.getElementById('wpadminbar')?.getBoundingClientRect().bottom || 0);
      document.documentElement.style.setProperty('--lakehub-admin-offset', `${adminBottom}px`);
      document.documentElement.style.setProperty('--lakehub-header-clearance', `${adminBottom + navbar.offsetHeight}px`);
      const delta = y - lastY;
      lastY = y;
      if (y <= navbar.offsetHeight || pinned()) {
        show();
        return;
      }
      if (!delta) return;
      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
      if (travel >= 24) navbar.classList.add('is-navbar-hidden');
      if (travel <= -8) show();
    };
    const scheduleNavbar = () => {
      if (!frame) frame = requestAnimationFrame(updateNavbar);
    };
    navbar.addEventListener('focusin', show);
    navbar.addEventListener('focusout', scheduleNavbar);
    new MutationObserver(() => {
      if (pinned()) show();
    }).observe(navbar, { subtree: true, attributes: true, attributeFilter: ['class'] });
    window.addEventListener('scroll', scheduleNavbar, { passive: true });
    window.addEventListener('resize', scheduleNavbar, { passive: true });
    window.addEventListener('pageshow', () => {
      lastY = Math.max(0, window.scrollY);
      show();
      scheduleNavbar();
    });
    new ResizeObserver(scheduleNavbar).observe(navbar);
    updateNavbar();
  }

  // Interactive newsletter form feedback
  document.querySelectorAll('.mc4wp-form, form.is-style-lakehub-newsletter').forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.querySelector('input[name="_mc4wp_form_id"]')) {
        event.preventDefault();
        const input = form.querySelector('.lakehub-newsletter-input');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!input || !submitBtn) return;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribed!';
        submitBtn.disabled = true;
        input.value = '';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 2500);
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Subscribing...';
      }
    });
  });

  // Ensure all external links open in a new tab with security attributes
  const ensureExternalAttributes = (link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    } catch (_) {}
  };

  const processExternalLinks = (root = document) => {
    root.querySelectorAll('a[href]').forEach(ensureExternalAttributes);
  };
  processExternalLinks();
})();

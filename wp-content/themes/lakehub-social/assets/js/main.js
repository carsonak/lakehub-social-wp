(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  if (toggle && nav) {
    const closeMenu = () => {
      document.body.classList.remove('menu-open');
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  const insightTrack = document.querySelector('.insight-cards');
  document.querySelectorAll('.insights-nav').forEach((button) => {
    button.addEventListener('click', () => {
      if (!insightTrack) return;
      const card = insightTrack.querySelector('.insight-card');
      const distance = card ? card.getBoundingClientRect().width + 20 : insightTrack.clientWidth;
      insightTrack.scrollBy({
        left: button.classList.contains('insights-nav--previous') ? -distance : distance,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    });
  });

  document.querySelectorAll('.program-card').forEach((card) => {
    const sweep = () => {
      card.classList.remove('is-sweeping');
      void card.offsetWidth;
      card.classList.add('is-sweeping');
    };

    card.addEventListener('pointerenter', sweep);
    card.addEventListener('focusin', sweep);
    card.addEventListener('animationend', (event) => {
      if (event.animationName === 'glass-sweep') card.classList.remove('is-sweeping');
    });
  });
})();

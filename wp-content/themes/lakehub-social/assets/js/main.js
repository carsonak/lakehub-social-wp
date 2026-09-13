/* Progressive enhancement: native Navigation owns the mobile menu. */
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hoverPointer = matchMedia('(hover: hover) and (pointer: fine)');

  // The template part owns the sticky footprint; native Navigation still owns its menu.
  const navbar = document.querySelector('.wp-site-blocks > header:has(.is-style-lakehub-header)');
  if (navbar) {
    let lastY = Math.max(0, window.scrollY);
    let travel = 0;
    let frame = 0;
    const pinned = () => navbar.contains(document.activeElement) || navbar.querySelector('.is-menu-open');
    const show = () => { if (navbar.classList.contains('is-navbar-hidden')) navbar.classList.remove('is-navbar-hidden'); travel = 0; };
    const updateNavbar = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const adminBottom = Math.max(0, document.getElementById('wpadminbar')?.getBoundingClientRect().bottom || 0);
      document.documentElement.style.setProperty('--lakehub-admin-offset', `${adminBottom}px`);
      document.documentElement.style.setProperty('--lakehub-header-clearance', `${adminBottom + navbar.offsetHeight}px`);
      const delta = y - lastY;
      lastY = y;
      if (y <= navbar.offsetHeight || pinned()) { show(); return; }
      if (!delta) return;
      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
      if (travel >= 24) navbar.classList.add('is-navbar-hidden');
      if (travel <= -8) show();
    };
    const scheduleNavbar = () => { if (!frame) frame = requestAnimationFrame(updateNavbar); };
    navbar.addEventListener('focusin', show);
    navbar.addEventListener('focusout', scheduleNavbar);
    new MutationObserver(() => { if (pinned()) show(); }).observe(navbar, {subtree: true, attributes: true, attributeFilter: ['class']});
    window.addEventListener('scroll', scheduleNavbar, {passive: true});
    window.addEventListener('resize', scheduleNavbar, {passive: true});
    window.addEventListener('pageshow', () => { lastY = Math.max(0, window.scrollY); show(); scheduleNavbar(); });
    new ResizeObserver(scheduleNavbar).observe(navbar);
    updateNavbar();
  }

  document.querySelectorAll('.is-style-lakehub-partner-logos').forEach((track) => {
    const logos = Array.from(track.children);
    if (!logos.length) return;
    const section = track.closest('.is-style-lakehub-partners');
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    track.setAttribute('aria-roledescription', 'carousel');
    track.setAttribute('aria-label', 'Partner organizations. Use Left and Right arrow keys to scroll.');

    let cycle = 0;
    let step = 0;
    let position = 0;
    let hovered = false;
    let focused = false;
    let visible = false;
    let pointer = null;
    let suppressClick = false;
    let frame = 0;
    let previousTime = 0;
    let observedWidth = -1;

    const normalize = () => {
      if (!cycle || focused) return;
      const left = track.scrollLeft;
      if (left < cycle || left >= cycle * 2) {
        track.scrollLeft = cycle + ((left % cycle) + cycle) % cycle;
      }
    };
    const canRun = () => cycle && !hovered && !focused && !pointer && visible && !document.hidden && !reducedMotion.matches;
    const tick = (time) => {
      frame = 0;
      if (!canRun()) return;
      if (previousTime) position += Math.min(time - previousTime, 64) * 0.025;
      previousTime = time;
      position = cycle + ((position % cycle) + cycle) % cycle;
      track.scrollLeft = position;
      frame = requestAnimationFrame(tick);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      if (canRun()) {
        position = track.scrollLeft;
        frame = requestAnimationFrame(tick);
      }
    };
    const rebuild = () => {
      track.querySelectorAll('[data-lakehub-repeat]').forEach((copy) => copy.remove());
      cycle = 0;
      track.scrollLeft = 0;
      const columns = Number(getComputedStyle(track).getPropertyValue('--lakehub-partner-columns'));
      step = logos[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap);
      if (logos.length > columns) {
        const repeat = () => logos.map((logo) => {
          const copy = logo.cloneNode(true);
          copy.dataset.lakehubRepeat = '';
          copy.setAttribute('aria-hidden', 'true');
          [copy, ...copy.querySelectorAll('[id]')].forEach((element) => element.removeAttribute('id'));
          copy.querySelectorAll('a, button, [tabindex]').forEach((element) => element.tabIndex = -1);
          return copy;
        });
        track.prepend(...repeat());
        track.append(...repeat());
        cycle = logos[0].getBoundingClientRect().left - track.firstElementChild.getBoundingClientRect().left;
        track.scrollLeft = cycle;
      }
      track.tabIndex = cycle ? 0 : -1;
      track.classList.toggle('is-scrollable', Boolean(cycle));
      if (track.contains(document.activeElement) && document.activeElement !== track) {
        document.activeElement.scrollIntoView({block: 'nearest', inline: 'nearest', behavior: 'instant'});
      }
      update();
    };
    section.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'touch') { hovered = true; update(); }
    });
    section.addEventListener('pointerleave', () => { hovered = false; update(); });
    section.addEventListener('focusin', () => { focused = true; update(); });
    section.addEventListener('focusout', (event) => {
      if (!section.contains(event.relatedTarget)) { focused = false; normalize(); update(); }
    });
    track.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      if (!cycle) return;
      // Rebase before stepping at an edge, including while keyboard focus pauses autoplay.
      if (track.scrollLeft < step || track.scrollLeft > track.scrollWidth - track.clientWidth - step) {
        track.scrollLeft = cycle + ((track.scrollLeft % cycle) + cycle) % cycle;
      }
      track.scrollBy({left: event.key === 'ArrowLeft' ? -step : step, behavior: reducedMotion.matches ? 'instant' : 'smooth'});
    });
    track.addEventListener('dragstart', (event) => event.preventDefault());
    track.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || event.button !== 0 || !cycle) return;
      // Repeated links remain clickable, but must never receive hidden keyboard focus.
      if (event.target.closest('[data-lakehub-repeat]')) event.preventDefault();
      pointer = {id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX, dragging: false};
      suppressClick = false;
      update();
    });
    track.addEventListener('pointermove', (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      if (!pointer.dragging) {
        const x = Math.abs(event.clientX - pointer.x);
        const y = Math.abs(event.clientY - pointer.y);
        if (y > x && y > 6) { pointer = null; update(); return; }
        if (x < 6) return;
        pointer.dragging = true;
        track.setPointerCapture(event.pointerId);
        track.classList.add('is-dragging');
      }
      track.scrollLeft += pointer.lastX - event.clientX;
      pointer.lastX = event.clientX;
      normalize();
    });
    const endDrag = (event) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      suppressClick = pointer.dragging;
      // A cancelled gesture may not emit a click; don't suppress a later keyboard activation.
      if (suppressClick) setTimeout(() => { suppressClick = false; }, 0);
      pointer = null;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
      update();
    };
    window.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('lostpointercapture', endDrag);
    track.addEventListener('click', (event) => {
      if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; }
    }, true);
    track.addEventListener('scroll', normalize, {passive: true});
    document.addEventListener('visibilitychange', update);
    reducedMotion.addEventListener('change', update);
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); }).observe(track);
    new ResizeObserver(([entry]) => {
      if (entry.contentRect.width !== observedWidth) { observedWidth = entry.contentRect.width; rebuild(); }
    }).observe(track);
  });

  const programCards = Array.from(document.querySelectorAll('.lakehub-program'));
  if (programCards.length && !reducedMotion.matches) {
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
        const threshold = Math.min(height / 2, viewHeight / 2);
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
      point = {x: event.clientX, y: event.clientY};
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

  document.querySelectorAll('.is-style-lakehub-timeline').forEach((track) => {
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    track.setAttribute('aria-label', 'Our journey. Use Left and Right arrow keys to explore milestones.');
    track.addEventListener('keydown', (event) => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      track.scrollBy({left: (event.key === 'ArrowLeft' ? -1 : 1) * (track.firstElementChild.getBoundingClientRect().width + 32), behavior: reducedMotion.matches ? 'instant' : 'smooth'});
    });
  });

  document.querySelectorAll('.wp-block-query.is-style-lakehub-insights').forEach((query) => {
    const track = query.querySelector('.wp-block-post-template');
    const cards = track ? Array.from(track.children) : [];
    if (!cards.length) return;
    query.classList.add('is-enhanced');
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    track.setAttribute('aria-label', 'Latest Insights. Use Left and Right arrow keys to browse.');
    let selected = innerWidth > 600 && cards.length > 1 ? 1 : 0;
    let target = null;
    let settleTimer;
    const controls = document.createElement('div');
    controls.className = 'lakehub-insights-controls';
    const status = document.createElement('p');
    status.className = 'screen-reader-text';
    status.setAttribute('aria-live', 'polite');
    const buttons = [-1, 1].map((direction) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = direction < 0 ? '‹' : '›';
      button.setAttribute('aria-label', direction < 0 ? 'Previous insight' : 'Next insight');
      button.addEventListener('click', () => go((target ?? selected) + direction));
      controls.append(button);
      return button;
    });
    const update = () => {
      cards.forEach((card, index) => card.classList.toggle('is-current', index === selected));
      buttons.forEach((button, index) => {
        const hidden = index === 0 ? selected === 0 : selected === cards.length - 1;
        if (hidden && document.activeElement === button) track.focus({preventScroll: true});
        button.hidden = hidden;
      });
      status.textContent = `Insight ${selected + 1} of ${cards.length}`;
    };
    const center = (index, behavior) => {
      const card = cards[index];
      track.scrollTo({left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2, behavior});
    };
    const go = (index) => {
      target = Math.max(0, Math.min(cards.length - 1, index));
      selected = target;
      update();
      center(selected, reducedMotion.matches ? 'instant' : 'smooth');
    };
    track.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || event.altKey || event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      go(event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : (target ?? selected) + (event.key === 'ArrowLeft' ? -1 : 1));
    });
    const settle = () => {
      // A delayed animation frame must not turn an intermediate position into the selection.
      if (target !== null) {
        const destination = cards[target].offsetLeft + cards[target].offsetWidth / 2 - track.clientWidth / 2;
        if (Math.abs(track.scrollLeft - destination) > 2) return;
      }
      target = null;
      const middle = track.scrollLeft + track.clientWidth / 2;
      selected = cards.reduce((best, card, index) => Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle) < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - middle) ? index : best, 0);
      update();
    };
    track.addEventListener('scroll', () => {
      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 160);
    }, {passive: true});
    track.addEventListener('scrollend', settle);
    track.addEventListener('pointerdown', () => { target = null; }, {passive: true});
    track.addEventListener('wheel', () => { target = null; }, {passive: true});
    track.addEventListener('focusin', (event) => {
      const index = cards.findIndex(card => card.contains(event.target));
      if (index >= 0 && index !== selected) go(index);
    });
    query.append(controls, status);
    new ResizeObserver(() => { center(selected, 'instant'); update(); }).observe(track);
    update();
    requestAnimationFrame(() => center(selected, 'instant'));
  });

  const metricRows = Array.from(document.querySelectorAll('.is-style-lakehub-metric-row'));
  if (metricRows.length && !reducedMotion.matches && 'IntersectionObserver' in window) {
    const revealCopy = (copy) => {
      copy.classList.add('is-revealed');
    };

    const metricObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const copy = entry.target.querySelector('.is-style-lakehub-metric-copy');
          if (copy) revealCopy(copy);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    metricRows.forEach((row) => {
      const copy = row.querySelector('.is-style-lakehub-metric-copy');
      if (!copy) return;
      copy.classList.add('is-reveal-ready');

      const rect = row.getBoundingClientRect();
      if (rect.top + rect.height * 0.5 <= window.innerHeight) {
        revealCopy(copy);
      } else {
        metricObserver.observe(row);
      }
    });

    reducedMotion.addEventListener('change', (event) => {
      if (!event.matches) return;
      metricObserver.disconnect();
      metricRows.forEach((row) => {
        const copy = row.querySelector('.is-style-lakehub-metric-copy');
        if (copy) revealCopy(copy);
      });
    });
  }

  const halftoneTargets = Array.from(document.querySelectorAll('.is-style-lakehub-story-photo, .is-style-lakehub-community-photo, .is-style-lakehub-portfolio-photo'));
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

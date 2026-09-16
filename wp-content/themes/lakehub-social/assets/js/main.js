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
    track.addEventListener('pointerenter', (event) => {
      if (event.pointerType !== 'touch') { hovered = true; update(); }
    });
    track.addEventListener('pointerleave', () => { hovered = false; update(); });
    track.addEventListener('focusin', () => { focused = true; update(); });
    track.addEventListener('focusout', (event) => {
      if (!track.contains(event.relatedTarget)) { focused = false; normalize(); update(); }
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
        const threshold = height * (1 / 3);
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
  if (metricRows.length) {
    const setRowRevealed = (row, isRevealed) => {
      if (isRevealed) {
        row.classList.add('is-revealed');
        const copy = row.querySelector('.is-style-lakehub-metric-copy');
        if (copy) copy.classList.add('is-revealed');
      } else {
        row.classList.remove('is-revealed');
        const copy = row.querySelector('.is-style-lakehub-metric-copy');
        if (copy) copy.classList.remove('is-revealed');
      }
    };

    metricRows.forEach((row) => {
      const copy = row.querySelector('.is-style-lakehub-metric-copy');
      if (copy) copy.classList.add('is-reveal-ready');
    });

    if (reducedMotion.matches) {
      metricRows.forEach((row) => setRowRevealed(row, true));
    } else {
      let bounds = [];
      let frame = 0;
      const measureMetricRows = () => {
        bounds = metricRows.map((row) => {
          let top = 0;
          let el = row;
          while (el) {
            top += el.offsetTop || 0;
            el = el.offsetParent;
          }
          return { row, top, height: row.offsetHeight };
        });
      };

      const updateMetricRows = () => {
        frame = 0;
        const scrollY = window.scrollY;
        const adminBottom = Math.max(0, document.getElementById('wpadminbar')?.getBoundingClientRect().bottom || 0);
        const headerClearance = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lakehub-header-clearance')) || (adminBottom + 80);
        const viewHeight = Math.max(200, window.innerHeight - headerClearance);

        bounds.forEach(({ row, top, height }) => {
          if (row.contains(document.activeElement)) {
            setRowRevealed(row, true);
            return;
          }
          const threshold = height * (1 / 3);
          const rowTopInView = top - scrollY - headerClearance;
          const rowBottomInView = rowTopInView + height;

          const inView = rowBottomInView >= threshold && rowTopInView <= viewHeight - threshold;
          setRowRevealed(row, inView);
        });
      };

      const scheduleMetricRows = () => {
        if (!frame) frame = requestAnimationFrame(updateMetricRows);
      };

      metricRows.forEach((row) => {
        row.addEventListener('focusin', scheduleMetricRows);
        row.addEventListener('focusout', scheduleMetricRows);
      });

      measureMetricRows();
      updateMetricRows();

      window.addEventListener('scroll', scheduleMetricRows, { passive: true });
      window.addEventListener('resize', () => { measureMetricRows(); scheduleMetricRows(); }, { passive: true });
      new ResizeObserver(() => { measureMetricRows(); scheduleMetricRows(); }).observe(document.body);

      reducedMotion.addEventListener('change', (event) => {
        if (event.matches) {
          metricRows.forEach((row) => setRowRevealed(row, true));
        } else {
          measureMetricRows();
          updateMetricRows();
        }
      });
    }
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

  // Home hero 4-image slideshow controller
  const heroSlides = Array.from(document.querySelectorAll('.lakehub-hero-slide'));
  if (heroSlides.length > 1) {
    let slideshowInterval = null;

    const startSlideshow = () => {
      if (slideshowInterval) clearInterval(slideshowInterval);
      let current = heroSlides.findIndex((slide) => slide.classList.contains('is-active'));
      if (current === -1) {
        current = 0;
        heroSlides[0].classList.add('is-active');
      }
      slideshowInterval = setInterval(() => {
        heroSlides[current].classList.remove('is-active');
        current = (current + 1) % heroSlides.length;
        heroSlides[current].classList.add('is-active');
      }, 3000);
    };

    const randomizeStaticSlide = () => {
      if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
      }
      const randomIndex = Math.floor(Math.random() * heroSlides.length);
      heroSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === randomIndex));
    };

    if (reducedMotion.matches) {
      randomizeStaticSlide();
    } else {
      startSlideshow();
    }

    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {
        randomizeStaticSlide();
      } else {
        startSlideshow();
      }
    });
  }

  // Blog post social share interactions
  const shareContainers = document.querySelectorAll('.lakehub-social-share-links');
  if (shareContainers.length) {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    document.querySelectorAll('.lakehub-share-btn.share-x').forEach((btn) => {
      btn.href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
    });
    document.querySelectorAll('.lakehub-share-btn.share-linkedin').forEach((btn) => {
      btn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
    });
    document.querySelectorAll('.lakehub-share-btn.share-facebook').forEach((btn) => {
      btn.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    });
    document.querySelectorAll('.lakehub-share-btn.share-copy').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          const originalTitle = btn.getAttribute('title') || 'Copy link';
          btn.setAttribute('title', 'Copied!');
          btn.classList.add('is-copied');
          setTimeout(() => {
            btn.setAttribute('title', originalTitle);
            btn.classList.remove('is-copied');
          }, 2000);
        } catch {
          // Fallback if clipboard API is restricted
          const input = document.createElement('input');
          input.value = window.location.href;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          document.body.removeChild(input);
          btn.classList.add('is-copied');
          setTimeout(() => btn.classList.remove('is-copied'), 2000);
        }
      });
    });
  }

  // Collapsible text sections ("Read More" / "Hide" with direction chevron)
  document.querySelectorAll('.is-style-lakehub-story-copy, [data-lakehub-collapsible]').forEach((container) => {
    const paragraphs = Array.from(container.querySelectorAll(':scope > p'));
    if (paragraphs.length <= 1) return;
    if (container.querySelector('.lakehub-collapsible-drawer')) return;

    const drawer = document.createElement('div');
    drawer.className = 'lakehub-collapsible-drawer is-collapsed';
    drawer.setAttribute('aria-expanded', 'false');

    // Thick rounded chevron SVGs matching down.png (stroke-width 4)
    const downChevronSvg = '<svg class="lakehub-toggle-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 9 12 16 19 9"></polyline></svg>';
    const upChevronSvg = '<svg class="lakehub-toggle-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 15 12 8 19 15"></polyline></svg>';

    // Insert drawer after paragraph 1
    paragraphs[0].after(drawer);

    // Move paragraphs 2+ into drawer
    for (let i = 1; i < paragraphs.length; i++) {
      drawer.appendChild(paragraphs[i]);
    }

    // Read More button placed right after drawer preview
    const readMoreBtn = document.createElement('button');
    readMoreBtn.type = 'button';
    readMoreBtn.className = 'lakehub-text-toggle-btn lakehub-btn-read-more';
    readMoreBtn.innerHTML = `<span>Read More</span> ${downChevronSvg}`;
    readMoreBtn.setAttribute('aria-label', 'Read more');
    drawer.after(readMoreBtn);

    // Hide button placed at the end of revealed text
    const hideBtn = document.createElement('button');
    hideBtn.type = 'button';
    hideBtn.className = 'lakehub-text-toggle-btn lakehub-btn-hide';
    hideBtn.innerHTML = `<span>Hide</span> ${upChevronSvg}`;
    hideBtn.setAttribute('aria-label', 'Hide text');
    drawer.appendChild(hideBtn);

    const expand = () => {
      drawer.classList.remove('is-collapsed');
      drawer.classList.add('is-expanded');
      drawer.setAttribute('aria-expanded', 'true');
      readMoreBtn.classList.add('is-hidden');
      readMoreBtn.style.setProperty('display', 'none', 'important');
      hideBtn.focus();
    };

    const collapse = () => {
      drawer.classList.remove('is-expanded');
      drawer.classList.add('is-collapsed');
      drawer.setAttribute('aria-expanded', 'false');
      readMoreBtn.classList.remove('is-hidden');
      readMoreBtn.style.removeProperty('display');
      readMoreBtn.focus();
      const topOffset = container.getBoundingClientRect().top + window.scrollY - 120;
      if (window.scrollY > topOffset) {
        window.scrollTo({ top: topOffset, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      }
    };

    readMoreBtn.addEventListener('click', expand);
    hideBtn.addEventListener('click', collapse);
  });

  // Interactive newsletter form feedback
  document.querySelectorAll('form.is-style-lakehub-newsletter').forEach((form) => {
    form.addEventListener('submit', (event) => {
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
    });
  });
})();


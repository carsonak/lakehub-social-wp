/* Progressive enhancement: native Navigation owns the mobile menu. */
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const hoverPointer = matchMedia('(hover: hover) and (pointer: fine)');

  document.querySelectorAll('.is-style-lakehub-partner-logos').forEach((track) => {
    const logos = Array.from(track.children);
    if (!logos.length) return;
    const section = track.closest('.is-style-lakehub-partners');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'lakehub-partners-toggle';
    section.append(toggle);
    track.tabIndex = 0;
    track.setAttribute('role', 'region');
    track.setAttribute('aria-roledescription', 'carousel');
    track.setAttribute('aria-label', 'Partner organizations. Use Left and Right arrow keys to scroll.');

    let cycle = 0;
    let step = 0;
    let position = 0;
    let paused = false;
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
    const canRun = () => cycle && !paused && !hovered && !focused && !pointer && visible && !document.hidden && !reducedMotion.matches;
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
      toggle.hidden = !cycle || reducedMotion.matches;
      toggle.textContent = paused ? 'Play' : 'Pause';
      toggle.setAttribute('aria-label', paused ? 'Play partner logo scrolling' : 'Pause partner logo scrolling');
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
    toggle.addEventListener('click', () => { paused = !paused; update(); });
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

  document.querySelectorAll('.lakehub-program').forEach((card) => {
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

  document.querySelectorAll('.wp-block-query.is-style-lakehub-insights').forEach((query) => {
    const track = query.querySelector('.wp-block-post-template');
    if (!track) return;
    const controls = document.createElement('div');
    controls.className = 'lakehub-insights-controls';
    const buttons = [-1, 1].map((direction) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = direction < 0 ? '←' : '→';
      button.setAttribute('aria-label', direction < 0 ? 'Previous insights' : 'Next insights');
      button.addEventListener('click', () => {
        const card = track.querySelector('li');
        track.scrollBy({left: direction * (card ? card.getBoundingClientRect().width + 24 : track.clientWidth), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      });
      controls.append(button);
      return button;
    });
    const update = () => {
      buttons[0].disabled = track.scrollLeft <= 1;
      buttons[1].disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
    };
    query.append(controls);
    track.addEventListener('scroll', update, {passive:true});
    new ResizeObserver(update).observe(track);
    update();
  });
})();

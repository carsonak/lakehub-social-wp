/**
 * LakeHub Social - Dynamic Reusable Halftone Pattern Generator
 *
 * Generates dynamic SVG halftone patterns for images:
 * - Circular concentric rings and Rectangular concentric rings
 * - Consistent uniform 20px dot spacing (non-configurable in editor)
 * - Vignette effect produced solely by dot radius shrinking outward
 * - Configurable spread (default 60px), central max dot size (default 7.5px), shrink factor (default 0.88), and color
 * - Interactive mouse repel physics via CSS custom properties (--lakehub-repel-x, --lakehub-repel-y)
 * - Automatic recalculation on window resize / layout changes via ResizeObserver
 *
 * @package LakeHub_Social
 */

(function () {
  'use strict';

  // Constant uniform dot spacing across all rings (20px)
  const SPACING = 20;

  /**
   * Generates rectangular concentric rings of halftone dots.
   * Rings expand outward in Chebyshev distance (max(|i|, |j|)) from center.
   */
  function generateRectangularSVG(width, height, spread, maxDot, shrinkFactor, color) {
    const totalW = Math.round(width + spread * 2);
    const totalH = Math.round(height + spread * 2);
    const cx = totalW / 2;
    const cy = totalH / 2;

    const maxI = Math.ceil(totalW / (2 * SPACING));
    const maxJ = Math.ceil(totalH / (2 * SPACING));

    let circles = '';

    for (let i = -maxI; i <= maxI; i++) {
      const x = +(cx + i * SPACING).toFixed(1);
      if (x < 0 || x > totalW) continue;

      for (let j = -maxJ; j <= maxJ; j++) {
        const y = +(cy + j * SPACING).toFixed(1);
        if (y < 0 || y > totalH) continue;

        const k = Math.max(Math.abs(i), Math.abs(j));
        // Dot radius shrinks monotonically with ring index k
        const r = Math.max(1.2, +(maxDot * Math.pow(shrinkFactor, k)).toFixed(2));
        circles += `<circle cx="${x}" cy="${y}" r="${r}" />`;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" aria-hidden="true"><g fill="${color}">${circles}</g></svg>`;
  }

  /**
   * Generates circular concentric rings of halftone dots.
   * Rings expand outward radially with uniform spacing along each circumference.
   */
  function generateCircularSVG(width, height, spread, maxDot, shrinkFactor, color) {
    const totalW = Math.round(width + spread * 2);
    const totalH = Math.round(height + spread * 2);
    const cx = totalW / 2;
    const cy = totalH / 2;
    const maxR = Math.hypot(totalW / 2, totalH / 2);

    // Center dot (ring 0)
    let circles = `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${maxDot.toFixed(2)}" />`;

    const numRings = Math.floor(maxR / SPACING);
    for (let k = 1; k <= numRings; k++) {
      const R = k * SPACING;
      const circumference = 2 * Math.PI * R;
      const numDots = Math.max(6, Math.round(circumference / SPACING));
      const r = Math.max(1.2, +(maxDot * Math.pow(shrinkFactor, k)).toFixed(2));

      for (let i = 0; i < numDots; i++) {
        const angle = (i / numDots) * 2 * Math.PI;
        const x = +(cx + R * Math.cos(angle)).toFixed(1);
        const y = +(cy + R * Math.sin(angle)).toFixed(1);
        if (x < 0 || x > totalW || y < 0 || y > totalH) continue;
        circles += `<circle cx="${x}" cy="${y}" r="${r}" />`;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}" aria-hidden="true"><g fill="${color}">${circles}</g></svg>`;
  }

  /**
   * Binds mouse repel physics to a halftone container if not already bound.
   */
  function bindRepelPhysics(target) {
    if (target._lakehubRepelBound) return;
    target._lakehubRepelBound = true;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');

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
          reset();
          return;
        }
        const maxCap = SPACING;
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
  }

  /**
   * Updates or mounts the dynamic halftone SVG on a target element.
   */
  function updateHalftone(target) {
    const rawTemplate = target.getAttribute('data-lakehub-halftone');
    const isLegacyPhoto = target.classList.contains('is-style-lakehub-story-photo') ||
      target.classList.contains('is-style-lakehub-community-photo') ||
      target.classList.contains('is-style-lakehub-portfolio-photo');

    const template = rawTemplate || (isLegacyPhoto ? 'rectangular' : null);

    if (!template || template === 'none') {
      const existing = target.querySelector('.lakehub-halftone-layer');
      if (existing) existing.remove();
      target.classList.remove('lakehub-halftone-active');
      return;
    }

    const spread = parseFloat(target.getAttribute('data-lakehub-halftone-spread')) || 60;
    const maxDot = parseFloat(target.getAttribute('data-lakehub-halftone-max-dot')) || 7.5;
    const shrinkFactor = parseFloat(target.getAttribute('data-lakehub-halftone-shrink')) || 0.88;
    const color = target.getAttribute('data-lakehub-halftone-color') || '#00676B';

    const w = target.clientWidth || target.offsetWidth;
    const h = target.clientHeight || target.offsetHeight;
    if (!w || !h) return;

    let svgHtml = '';
    if (template === 'circular') {
      svgHtml = generateCircularSVG(w, h, spread, maxDot, shrinkFactor, color);
    } else {
      svgHtml = generateRectangularSVG(w, h, spread, maxDot, shrinkFactor, color);
    }

    let layer = target.querySelector('.lakehub-halftone-layer');
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'lakehub-halftone-layer';
      layer.setAttribute('aria-hidden', 'true');
      target.prepend(layer);
    }

    layer.innerHTML = svgHtml;
    target.classList.add('lakehub-halftone-active');

    // Bind mouse repel physics
    bindRepelPhysics(target);
  }

  let resizeObserver = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updateHalftone(entry.target);
      }
    });
  }

  function initHalftones() {
    const selector = '[data-lakehub-halftone], .is-style-lakehub-story-photo, .is-style-lakehub-community-photo, .is-style-lakehub-portfolio-photo';
    const targets = Array.from(document.querySelectorAll(selector));

    targets.forEach((target) => {
      updateHalftone(target);
      if (resizeObserver) {
        resizeObserver.observe(target);
      }
      // Re-run once image loads in case dimensions change
      const img = target.querySelector('img');
      if (img && !img.complete) {
        img.addEventListener('load', () => updateHalftone(target), { once: true });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHalftones);
  } else {
    initHalftones();
  }

  // Expose global API for programmatic or editor usage
  window.lakehubHalftone = {
    update: updateHalftone,
    init: initHalftones,
    generateCircularSVG: generateCircularSVG,
    generateRectangularSVG: generateRectangularSVG,
    SPACING: SPACING,
  };
})();

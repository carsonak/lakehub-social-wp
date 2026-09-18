/**
 * Metric row scroll reveal and line animation interactions.
 *
 * @package LakeHub_Social
 */

(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const metricRows = Array.from(document.querySelectorAll('.is-style-lakehub-metric-row'));

  if (!metricRows.length) return;

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
    return;
  }

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

  const updateMetricLineGeometry = () => {
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    metricRows.forEach((row, index) => {
      if (index === metricRows.length - 1) return;
      const photo = row.querySelector('.is-style-lakehub-metric-photo');
      const numP = photo ? photo.querySelector('p') : null;
      if (!photo || !numP) return;

      const rowWidth = row.offsetWidth;
      const numWidth = numP.offsetWidth;
      if (!rowWidth || !numWidth) return;

      const photoStyle = getComputedStyle(photo);
      const shiftX = (parseFloat(photoStyle.getPropertyValue('--lakehub-photo-shift-x')) || 0) * rootFontSize;
      const centerShift = (parseFloat(photoStyle.getPropertyValue('--lakehub-photo-center-shift')) || 0) * rootFontSize;

      const unrevealedCenter = photo.offsetLeft + numP.offsetLeft + (numWidth / 2) + shiftX + centerShift;
      const halfWidth = (numWidth + 32) / 2;

      const left = Math.max(0, Math.round(unrevealedCenter - halfWidth));
      const right = Math.max(0, Math.round(rowWidth - (unrevealedCenter + halfWidth)));

      row.style.setProperty('--lakehub-line-left', `${left}px`);
      row.style.setProperty('--lakehub-line-right', `${right}px`);
    });
  };

  measureMetricRows();
  updateMetricRows();
  updateMetricLineGeometry();
  if (document.fonts?.ready) {
    document.fonts.ready.then(updateMetricLineGeometry);
  }

  window.addEventListener('scroll', scheduleMetricRows, { passive: true });
  window.addEventListener('resize', () => {
    measureMetricRows();
    updateMetricLineGeometry();
    scheduleMetricRows();
  }, { passive: true });
  new ResizeObserver(() => {
    measureMetricRows();
    updateMetricLineGeometry();
    scheduleMetricRows();
  }).observe(document.body);

  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
      metricRows.forEach((row) => setRowRevealed(row, true));
    } else {
      measureMetricRows();
      updateMetricRows();
      updateMetricLineGeometry();
    }
  });
})();

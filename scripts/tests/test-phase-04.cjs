/**
 * Test Phase 04: Dynamic Reusable Halftone Generator & Block Editor Controls
 */
const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('Testing Phase 04: Dynamic Halftone Generator...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Test 1: Frontend About page halftone rendering
  await page.goto('http://localhost:8881/about/', { waitUntil: 'networkidle' });
  const aboutInfo = await page.evaluate(() => {
    const fig = document.querySelector('.is-style-lakehub-story-photo');
    if (!fig) return null;
    const layer = fig.querySelector('.lakehub-halftone-layer');
    const svg = layer ? layer.querySelector('svg') : null;
    const circles = svg ? Array.from(svg.querySelectorAll('circle')) : [];
    return {
      isActive: fig.classList.contains('lakehub-halftone-active'),
      hasLayer: !!layer,
      hasSvg: !!svg,
      circleCount: circles.length,
      svgWidth: svg ? parseFloat(svg.getAttribute('width')) : 0,
      svgHeight: svg ? parseFloat(svg.getAttribute('height')) : 0,
      color: svg ? svg.querySelector('g')?.getAttribute('fill') : null,
      maxR: circles.length ? Math.max(...circles.map(c => parseFloat(c.getAttribute('r')))) : 0,
      minR: circles.length ? Math.min(...circles.map(c => parseFloat(c.getAttribute('r')))) : 0,
    };
  });

  assert(aboutInfo, 'About story photo figure must exist');
  assert(aboutInfo.isActive, 'Figure must have lakehub-halftone-active class');
  assert(aboutInfo.hasLayer, 'Figure must have lakehub-halftone-layer container');
  assert(aboutInfo.hasSvg, 'Layer must contain an SVG element');
  assert(aboutInfo.circleCount > 100, `Circle count should be > 100 (got ${aboutInfo.circleCount})`);
  assert.strictEqual(aboutInfo.color, '#00676B', 'Default fill color must be #00676B');
  assert(aboutInfo.maxR >= 7.5, `Max dot radius must be at least 7.5 (got ${aboutInfo.maxR})`);
  assert(aboutInfo.minR < 5.0, `Min dot radius should shrink below 5.0 (got ${aboutInfo.minR})`);
  console.log('✓ About story photo dynamic halftone verified with', aboutInfo.circleCount, 'dots.');

  // Test 2: Repel physics on About story photo
  const repelResult = await page.evaluate(async () => {
    const fig = document.querySelector('.is-style-lakehub-story-photo');
    const rect = fig.getBoundingClientRect();
    fig.dispatchEvent(new PointerEvent('pointermove', {
      clientX: rect.left + rect.width * 0.75,
      clientY: rect.top + rect.height * 0.75,
      bubbles: true,
      pointerType: 'mouse',
    }));
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const moved = {
      x: fig.style.getPropertyValue('--lakehub-repel-x'),
      y: fig.style.getPropertyValue('--lakehub-repel-y'),
    };
    fig.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
    const reset = {
      x: fig.style.getPropertyValue('--lakehub-repel-x'),
      y: fig.style.getPropertyValue('--lakehub-repel-y'),
    };
    return { moved, reset };
  });

  assert(repelResult.moved.x && repelResult.moved.x !== '0px', 'Pointer move must displace --lakehub-repel-x');
  assert(repelResult.moved.y && repelResult.moved.y !== '0px', 'Pointer move must displace --lakehub-repel-y');
  assert.strictEqual(repelResult.reset.x, '0px', 'Pointer leave must reset --lakehub-repel-x to 0px');
  assert.strictEqual(repelResult.reset.y, '0px', 'Pointer leave must reset --lakehub-repel-y to 0px');
  console.log('✓ Repel physics on pointer move and pointer leave verified.');

  // Test 3: Circular template and custom attributes
  const circularResult = await page.evaluate(() => {
    const div = document.createElement('figure');
    div.setAttribute('data-lakehub-halftone', 'circular');
    div.setAttribute('data-lakehub-halftone-color', '#F15A24');
    div.setAttribute('data-lakehub-halftone-spread', '40');
    div.setAttribute('data-lakehub-halftone-max-dot', '10');
    div.setAttribute('data-lakehub-halftone-shrink', '0.85');
    div.style.width = '400px';
    div.style.height = '300px';
    document.body.appendChild(div);

    window.lakehubHalftone.update(div);
    const layer = div.querySelector('.lakehub-halftone-layer');
    const svg = layer ? layer.querySelector('svg') : null;
    const circles = svg ? Array.from(svg.querySelectorAll('circle')) : [];
    const res = {
      hasSvg: !!svg,
      width: svg?.getAttribute('width'),
      height: svg?.getAttribute('height'),
      color: svg?.querySelector('g')?.getAttribute('fill'),
      circleCount: circles.length,
      firstDotR: circles.length ? parseFloat(circles[0].getAttribute('r')) : 0,
    };
    div.remove();
    return res;
  });

  assert(circularResult.hasSvg, 'Circular halftone must render SVG');
  assert.strictEqual(circularResult.width, '480', 'Width with 40px spread on 400px frame must be 480');
  assert.strictEqual(circularResult.height, '480', 'Height for circular template must equal diameter (480)');
  assert.strictEqual(circularResult.color, '#F15A24', 'Custom color #F15A24 must be applied');
  assert.strictEqual(circularResult.firstDotR, 10, 'Custom max dot 10 must be applied to center dot');
  console.log('✓ Circular template and custom parameters verified.');

  await browser.close();
  console.log('All Phase 04 tests PASSED successfully!');
})();

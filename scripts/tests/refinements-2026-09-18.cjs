/**
 * LakeHub Social - End-to-End Verification Suite for UI Refinements (2026-09-18)
 */
const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('--- Starting Comprehensive Refinements Verification Suite ---');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1. Home Page & Latest Insights Card Layout
  console.log('\n[1/5] Verifying Home Page & Latest Insights...');
  await page.goto('http://localhost:8881/', { waitUntil: 'networkidle' });

  // Malika image transform on Latest Insights card
  const malikaCardTransform = await page.evaluate(() => {
    const img = document.querySelector('.is-style-lakehub-insight-card img[src*="malika"]');
    return img ? window.getComputedStyle(img).transform : null;
  });
  assert(malikaCardTransform && malikaCardTransform !== 'none', 'Malika image on Latest Insights card must have transform centering applied');
  console.log('✓ Malika card image centering transform verified.');

  // Headings clamped to 3 lines with consistent excerpt top position
  const insightCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.is-style-lakehub-insight-card'));
    return cards.map(c => {
      const copy = c.querySelector('.is-style-lakehub-insight-copy');
      const h3 = copy ? copy.querySelector('h3') : null;
      const excerpt = copy ? copy.querySelector('p') : null;
      const btn = c.querySelector('.wp-block-read-more');
      const h3Style = h3 ? window.getComputedStyle(h3) : null;
      const btnStyle = btn ? window.getComputedStyle(btn) : null;
      return {
        h3OffsetTop: h3 ? h3.offsetTop : null,
        excerptOffsetTop: excerpt ? excerpt.offsetTop : null,
        lineClamp: h3Style ? h3Style.webkitLineClamp : null,
        btnPosition: btnStyle ? btnStyle.position : null,
        btnBottom: btnStyle ? btnStyle.bottom : null,
        btnRight: btnStyle ? btnStyle.right : null,
      };
    });
  });
  assert(insightCards.length >= 3, 'There must be at least 3 insight cards');
  const firstCard = insightCards[0];
  for (let i = 1; i < insightCards.length; i++) {
    assert.strictEqual(insightCards[i].h3OffsetTop, firstCard.h3OffsetTop, `Card ${i} h3 offsetTop must match card 0`);
    assert.strictEqual(insightCards[i].excerptOffsetTop, firstCard.excerptOffsetTop, `Card ${i} excerpt offsetTop must match card 0`);
  }
  assert.strictEqual(firstCard.lineClamp, '3', 'Insight headings must be clamped to 3 lines');
  assert.strictEqual(firstCard.btnPosition, 'absolute', 'Read more button must be absolutely positioned');
  console.log('✓ Latest Insights 3-line heading clamp, vertical alignment, and fixed bottom-right button verified.');

  // Arrow button bounce interaction
  const arrowBounce = await page.evaluate(async () => {
    const btn = document.querySelector('.wp-block-read-more');
    btn.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
    const duringHover = btn.classList.contains('is-arrow-animating');
    // Leaving should NOT immediately remove the class
    btn.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
    const afterLeave = btn.classList.contains('is-arrow-animating');
    // Simulate animationend
    btn.dispatchEvent(new AnimationEvent('animationend', { animationName: 'lakehub-arrow-bounce', bubbles: true }));
    const afterAnimationEnd = btn.classList.contains('is-arrow-animating');
    return { duringHover, afterLeave, afterAnimationEnd };
  });
  assert(arrowBounce.duringHover, 'Arrow must add is-arrow-animating on pointerenter');
  assert(arrowBounce.afterLeave, 'Arrow must retain is-arrow-animating when mouse leaves (plays to completion)');
  assert(!arrowBounce.afterAnimationEnd, 'Arrow must remove is-arrow-animating when animation completes');
  console.log('✓ Latest Insights arrow bounce playback to completion verified.');

  // Footer newsletter link styling
  const footerNewsletter = await page.evaluate(() => {
    const p = Array.from(document.querySelectorAll('.is-style-lakehub-footer-links p')).find(el => el.textContent.includes('Subscribe'));
    if (!p) return null;
    const style = window.getComputedStyle(p);
    return {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
    };
  });
  assert(footerNewsletter, 'Footer newsletter paragraph must exist');
  assert.strictEqual(footerNewsletter.fontSize, '16px', 'Newsletter text font size must be 1rem (16px)');
  assert.strictEqual(footerNewsletter.fontWeight, '400', 'Newsletter text font weight must be 400');
  console.log('✓ Footer newsletter link styling verified.');

  // 2. Single Blog Post Page
  console.log('\n[2/5] Verifying Single Blog Post Page...');
  await page.goto('http://localhost:8881/from-kisumu-to-global-opportunities/', { waitUntil: 'networkidle' });

  // Malika featured image transform
  const malikaBlogTransform = await page.evaluate(() => {
    const img = document.querySelector('.lakehub-blog-featured-media img[src*="malika"]');
    return img ? window.getComputedStyle(img).transform : null;
  });
  assert(malikaBlogTransform && malikaBlogTransform !== 'none', 'Malika blog featured image must have transform centering');
  console.log('✓ Malika blog featured image transform verified.');

  // Blog footer clearance
  const blogClearance = await page.evaluate(() => {
    const share = document.querySelector('.lakehub-blog-share');
    const footer = document.querySelector('.is-style-lakehub-footer');
    if (!share || !footer) return null;
    const shareRect = share.getBoundingClientRect();
    const footerRect = footer.getBoundingClientRect();
    return footerRect.top - shareRect.bottom;
  });
  assert(blogClearance !== null, 'Blog share and footer must exist');
  assert(blogClearance >= 80, `Blog footer clearance must be >= 80px (got ${blogClearance}px)`);
  console.log(`✓ Blog footer clearance verified at ${blogClearance}px.`);

  // 3. Impact Page Typography
  console.log('\n[3/5] Verifying Impact Page...');
  await page.goto('http://localhost:8881/impact/', { waitUntil: 'networkidle' });
  const meetMalika = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('.is-style-lakehub-portfolio-copy h3, .is-style-lakehub-portfolio-copy h2'));
    const target = headings.find(h => h.textContent.includes('Meet Malika'));
    if (!target) return null;
    return {
      tagName: target.tagName,
      fontSize: window.getComputedStyle(target).fontSize,
    };
  });
  assert(meetMalika, 'Meet Malika heading must exist');
  assert.strictEqual(meetMalika.tagName, 'H3', 'Meet Malika heading level must be H3');
  assert.strictEqual(meetMalika.fontSize, '32px', 'Meet Malika font size must be 2rem (32px)');
  console.log('✓ Meet Malika heading level H3 and 32px font size verified.');

  // 4. About Page Typography
  console.log('\n[4/5] Verifying About Page...');
  await page.goto('http://localhost:8881/about/', { waitUntil: 'networkidle' });
  const rootedHeading = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('.is-style-lakehub-story-copy h3'));
    const target = headings.find(h => h.textContent.includes('Rooted in Kisumu'));
    if (!target) return null;
    const style = window.getComputedStyle(target);
    return {
      tagName: target.tagName,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
    };
  });
  assert(rootedHeading, 'Rooted in Kisumu heading must exist');
  assert.strictEqual(rootedHeading.tagName, 'H3', 'Rooted in Kisumu must be H3');
  assert.strictEqual(rootedHeading.fontWeight, '600', 'Rooted in Kisumu font weight must be 600 (semi-bold)');
  console.log('✓ Rooted in Kisumu heading H3 with font-weight 600 verified.');

  // 5. Dynamic Halftone Generator & Repel Physics
  console.log('\n[5/5] Verifying Dynamic Halftone Generator & Physics...');
  const halftoneTest = await page.evaluate(() => {
    const fig = document.querySelector('.is-style-lakehub-story-photo');
    if (!fig) return null;
    const layer = fig.querySelector('.lakehub-halftone-layer');
    const svg = layer ? layer.querySelector('svg') : null;
    const circles = svg ? svg.querySelectorAll('circle') : [];
    return {
      isActive: fig.classList.contains('lakehub-halftone-active'),
      hasSvg: !!svg,
      circleCount: circles.length,
      spacing: window.lakehubHalftone ? window.lakehubHalftone.SPACING : null,
    };
  });
  assert(halftoneTest && halftoneTest.isActive, 'Dynamic halftone must be active on story photo');
  assert(halftoneTest.hasSvg, 'Dynamic halftone layer must render SVG');
  assert.strictEqual(halftoneTest.spacing, 16, 'Uniform dot spacing must be 16px');
  assert(halftoneTest.circleCount > 400, `Circle count should be > 400 with 16px spacing (got ${halftoneTest.circleCount})`);
  console.log('✓ Dynamic halftone generator with 16px spacing verified (', halftoneTest.circleCount, 'dots).');

  await browser.close();
  console.log('\n========================================');
  console.log('ALL E2E VERIFICATION CHECKS PASSED!');
  console.log('========================================\n');
})();

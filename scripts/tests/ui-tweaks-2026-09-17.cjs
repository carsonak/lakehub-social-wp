/**
 * End-to-end test suite for LakeHub Social UI Tweaks (2026-09-17).
 */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const base = process.env.LAKEHUB_TEST_URL || 'http://localhost:8881';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  const open = async (path = '/') => {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
  };

  try {
    console.log('--- Testing LakeHub Social UI Tweaks (2026-09-17) ---');

    // -------------------------------------------------------------------------
    // Test 3: 404 Search Removal & Upward Top-Right Arrows
    // -------------------------------------------------------------------------
    console.log('Testing Task 03: 404 page search removal and home link...');
    await open('/non-existent-page-404-check/');
    const searchInputs = await page.locator('main input[type="search"]').count();
    assert.equal(searchInputs, 0, '404 page main content should have 0 search inputs');
    const backBtn = await page.locator('main a[href="/"]').first();
    assert.ok(await backBtn.isVisible(), '404 page should have a Back to Home button');

    // -------------------------------------------------------------------------
    // Test 4: Latest Insights Arrow Bounce
    // -------------------------------------------------------------------------
    console.log('Testing Task 04: Latest Insights arrow bounce animation...');
    await open('/');
    const card = page.locator('.is-style-lakehub-insight-card').first();
    await card.scrollIntoViewIfNeeded();

    // Check before hover: animation is none
    const animBefore = await card.locator('.wp-block-read-more').evaluate(el => {
      const pseudo = window.getComputedStyle(el, '::before');
      return pseudo.animationName;
    });
    console.log('Animation before hover:', animBefore);

    // Hover card
    await card.hover();
    const animHover = await card.locator('.wp-block-read-more').evaluate(el => {
      const pseudo = window.getComputedStyle(el, '::before');
      return {
        name: pseudo.animationName,
        duration: pseudo.animationDuration,
        timing: pseudo.animationTimingFunction
      };
    });
    console.log('Animation on hover:', animHover);
    assert.equal(animHover.name, 'lakehub-arrow-bounce', 'Arrow should have lakehub-arrow-bounce animation on hover');
    assert.equal(animHover.duration, '2s', 'Animation duration should be 2s');

    // Test prefers-reduced-motion
    const reducedMotionPage = await context.newPage();
    await reducedMotionPage.emulateMedia({ reducedMotion: 'reduce' });
    await reducedMotionPage.goto(base + '/', { waitUntil: 'networkidle' });
    const cardReduced = reducedMotionPage.locator('.is-style-lakehub-insight-card').first();
    await cardReduced.scrollIntoViewIfNeeded();
    await cardReduced.hover();
    const animReduced = await cardReduced.locator('.wp-block-read-more').evaluate(el => {
      const pseudo = window.getComputedStyle(el, '::before');
      return pseudo.animationName;
    });
    console.log('Animation with prefers-reduced-motion:', animReduced);
    assert.equal(animReduced, 'none', 'Animation should be disabled under prefers-reduced-motion: reduce');
    await reducedMotionPage.close();

    // -------------------------------------------------------------------------
    // Test 5: External Links Target _blank
    // -------------------------------------------------------------------------
    console.log('Testing Task 05: External links open in new tab with noopener noreferrer...');
    await open('/');
    const partnerLinks = await page.locator('.is-style-lakehub-partner-logos a').all();
    assert.ok(partnerLinks.length > 0, 'Should have partner links');
    for (const link of partnerLinks) {
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      assert.equal(target, '_blank', 'Partner link target must be _blank');
      assert.ok(rel && rel.includes('noopener') && rel.includes('noreferrer'), 'Partner link rel must include noopener and noreferrer');
    }

    const footerLinks = await page.locator('.is-style-lakehub-social-icon a').all();
    assert.ok(footerLinks.length > 0, 'Should have footer social links');
    for (const link of footerLinks) {
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      assert.equal(target, '_blank', 'Footer social link target must be _blank');
      assert.ok(rel && rel.includes('noopener') && rel.includes('noreferrer'), 'Footer social link rel must include noopener and noreferrer');
    }

    // -------------------------------------------------------------------------
    // Test 6: Impact Separating Lines Symmetrical Center Shrink
    // -------------------------------------------------------------------------
    console.log('Testing Task 06: Impact separating lines symmetrical shrink & center alignment...');
    await open('/');
    const metricRows = await page.locator('.is-style-lakehub-metric-row').all();
    assert.ok(metricRows.length >= 4, 'Should have 4 metric rows');

    // Ensure rows are in unrevealed exit state to test shrunk geometry
    for (let i = 0; i < 3; i++) {
      await metricRows[i].evaluate((r) => r.classList.remove('is-revealed'));
    }
    await page.waitForTimeout(600);

    for (let i = 0; i < 3; i++) {
      const row = metricRows[i];
      const data = await row.evaluate((r) => {
        const cs = window.getComputedStyle(r);
        const leftVar = parseFloat(cs.getPropertyValue('--lakehub-line-left')) || 0;
        const rightVar = parseFloat(cs.getPropertyValue('--lakehub-line-right')) || 0;
        const rWidth = r.offsetWidth;
        const p = r.querySelector('.is-style-lakehub-metric-photo p');
        const pWidth = p.offsetWidth;
        const lineWidth = rWidth - leftVar - rightVar;
        const lineCenter = leftVar + lineWidth / 2;

        // Visual unrevealed center of number p
        const pBox = p.getBoundingClientRect();
        const rBox = r.getBoundingClientRect();
        const pVisualCenter = (pBox.left + pBox.width / 2) - rBox.left;

        const afterPseudo = window.getComputedStyle(r, '::after');

        return {
          rWidth,
          pWidth,
          leftVar,
          rightVar,
          lineWidth,
          lineCenter,
          pVisualCenter,
          diffCenter: Math.abs(lineCenter - pVisualCenter),
          diffWidth: Math.abs(lineWidth - (pWidth + 32)),
          transition: afterPseudo.transition
        };
      });

      console.log(`Row ${i + 1} line geometry:`, data);
      assert.ok(data.diffCenter < 3, `Row ${i + 1} line center should match number center (diff: ${data.diffCenter}px)`);
      assert.ok(data.diffWidth < 3, `Row ${i + 1} line width should be number width + 32px (diff: ${data.diffWidth}px)`);
      assert.ok(data.transition.includes('left') && data.transition.includes('right'), `Row ${i + 1} should transition left and right`);
    }

    // Test revealed state expands line to left: 0, right: 0
    await metricRows[0].evaluate((r) => r.classList.add('is-revealed'));
    await page.waitForTimeout(600);
    const revealedPseudo = await metricRows[0].evaluate((r) => {
      const cs = window.getComputedStyle(r, '::after');
      return { left: cs.left, right: cs.right };
    });
    console.log('Row 1 revealed line state:', revealedPseudo);
    assert.equal(revealedPseudo.left, '0px', 'Revealed line left should be 0px');
    assert.equal(revealedPseudo.right, '0px', 'Revealed line right should be 0px');

    console.log('\nAll tests passed successfully!');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

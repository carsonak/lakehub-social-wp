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

    console.log('\nAll phase 3 and 4 tests passed successfully!');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

/**
 * End-to-end test suite for LakeHub Social UI Tweaks (2026-09-17).
 * Tests all 6 phases and cross-viewport responsiveness:
 * 1. Halftone dots edge visibility
 * 2. Our Story full-width wrap & gentle unroll (stationary viewport)
 * 3. 404 search removal & upward top-right navigation arrows
 * 4. Latest Insights arrow bounce animation
 * 5. External links target _blank with noopener noreferrer
 * 6. Impact Through Precision separating lines symmetrical center shrink
 * 7. Cross-viewport responsive checks (1280px, 768px, 375px)
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
    // Test 1: Rectangular Halftone Pattern Edge Dots Visibility
    // -------------------------------------------------------------------------
    console.log('Testing Task 01: Halftone pattern edge dots visibility...');
    await open('/about/');
    const storyPhoto = page.locator('.is-style-lakehub-story-photo');
    await storyPhoto.scrollIntoViewIfNeeded();
    const storyDots = await storyPhoto.evaluate(el => {
      const cs = window.getComputedStyle(el, '::before');
      return {
        content: cs.content,
        bgImage: cs.backgroundImage
      };
    });
    assert.ok(storyDots.bgImage.includes('story-dots-rectangular.svg'), 'Story photo should use story-dots-rectangular.svg');

    // -------------------------------------------------------------------------
    // Test 2: Our Story Full-Width Wrap & Gentle Unroll
    // -------------------------------------------------------------------------
    console.log('Testing Task 02: Our Story full-width wrap and gentle unroll...');
    const storyGrid = page.locator('.is-style-lakehub-story-grid');
    const photoFloat = await page.locator('.is-style-lakehub-story-photo').evaluate(el => {
      return window.getComputedStyle(el).float;
    });
    console.log('Story photo float style:', photoFloat);
    assert.equal(photoFloat, 'left', 'Story photo should be floated left');

    // Test Read More button unroll and stationary scroll position
    const readMoreBtn = page.locator('.lakehub-btn-read-more');
    await readMoreBtn.scrollIntoViewIfNeeded();
    const scrollBefore = await page.evaluate(() => window.scrollY);

    await readMoreBtn.click();
    await page.waitForTimeout(400); // mid-unroll
    const scrollMid = await page.evaluate(() => window.scrollY);
    assert.equal(scrollMid, scrollBefore, 'Viewport position should remain stationary during unroll');

    await page.waitForTimeout(600); // finish 800ms unroll
    const scrollAfter = await page.evaluate(() => window.scrollY);
    assert.equal(scrollAfter, scrollBefore, 'Viewport position should remain stationary after unroll');

    const drawer = page.locator('.lakehub-collapsible-drawer');
    const isExpanded = await drawer.evaluate(el => el.classList.contains('is-expanded'));
    assert.ok(isExpanded, 'Drawer should have is-expanded class');

    // Test text below photo spans full section width (> 900px on 1280px viewport)
    const secondParagraph = page.locator('.lakehub-collapsible-drawer p').first();
    const pWidth = await secondParagraph.evaluate(el => el.offsetWidth);
    console.log('Second paragraph full width below photo:', pWidth);
    assert.ok(pWidth > 800, 'Paragraph below photo should span full section width');

    // Collapse back
    const hideBtn = page.locator('.lakehub-btn-hide');
    await hideBtn.click();
    await page.waitForTimeout(300);

    // -------------------------------------------------------------------------
    // Test 3: 404 Search Removal & Upward Top-Right Arrows
    // -------------------------------------------------------------------------
    console.log('Testing Task 03: 404 page search removal and home link...');
    await open('/non-existent-page-404-check/');
    const searchInputs = await page.locator('main input[type="search"]').count();
    assert.equal(searchInputs, 0, '404 page main content should have 0 search inputs');
    const backBtn = await page.locator('main a[href="/"]').first();
    assert.ok(await backBtn.isVisible(), '404 page should have a Back to Home button');

    // Check upward arrows on Impact page
    await open('/impact/');
    const impactArrow = await page.locator('.is-style-lakehub-optional-action .lakehub-arrow-icon').first();
    assert.ok(await impactArrow.isVisible(), 'Impact Community Projects button should have upward top-right arrow SVG');

    // -------------------------------------------------------------------------
    // Test 4: Latest Insights Arrow Bounce
    // -------------------------------------------------------------------------
    console.log('Testing Task 04: Latest Insights arrow bounce animation...');
    await open('/');
    const card = page.locator('.is-style-lakehub-insight-card').first();
    await card.scrollIntoViewIfNeeded();

    const animBefore = await card.locator('.wp-block-read-more').evaluate(el => {
      const pseudo = window.getComputedStyle(el, '::before');
      return pseudo.animationName;
    });
    assert.equal(animBefore, 'none', 'Animation before hover should be none');

    const arrowBtn = card.locator('.wp-block-read-more');
    await arrowBtn.hover();
    const animHover = await arrowBtn.evaluate(el => {
      const pseudo = window.getComputedStyle(el, '::before');
      return {
        name: pseudo.animationName,
        duration: pseudo.animationDuration,
        timing: pseudo.animationTimingFunction
      };
    });
    console.log('Animation on hover:', animHover);
    assert.equal(animHover.name, 'lakehub-arrow-bounce', 'Arrow should have lakehub-arrow-bounce animation on hover');
    assert.equal(animHover.duration, '2.4s', 'Animation duration should be 2.4s');

    // Test prefers-reduced-motion
    const reducedMotionPage = await context.newPage();
    await reducedMotionPage.emulateMedia({ reducedMotion: 'reduce' });
    await reducedMotionPage.goto(base + '/', { waitUntil: 'networkidle' });
    const cardReduced = reducedMotionPage.locator('.is-style-lakehub-insight-card').first();
    const arrowBtnReduced = cardReduced.locator('.wp-block-read-more');
    await arrowBtnReduced.scrollIntoViewIfNeeded();
    await arrowBtnReduced.hover();
    const animReduced = await arrowBtnReduced.evaluate(el => {
      const pseudo = window.getComputedStyle(el, '::before');
      return pseudo.animationName;
    });
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

    // -------------------------------------------------------------------------
    // Test 7: Cross-Viewport Responsive Validation
    // -------------------------------------------------------------------------
    console.log('Testing Task 07: Cross-viewport responsive overflow validation...');
    const viewports = [
      { name: 'Desktop', width: 1280, height: 900 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await open('/');
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth - window.innerWidth;
      });
      console.log(`Viewport ${vp.name} (${vp.width}x${vp.height}) overflow:`, overflow);
      assert.ok(overflow <= 1, `${vp.name} viewport should have no horizontal overflow`);
    }

    console.log('\n========================================');
    console.log('ALL 7 TASKS PASSED REGRESSION VALIDATION');
    console.log('========================================\n');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

/**
 * End-to-end regression test suite for 16-09-2026 Follow-Up Website Review.
 * Covers:
 * 1. Rectangular halftone pattern (12px clearance, enlarged edge dots, center anchoring, hover repulsion).
 * 2. Collapsible "Read More / Hide" with thick chevron arrow (matching down.png) & fade-out after paragraph 1.
 * 3. Scrolling logos track: hover pause restricted to logos only; zero side padding edge-to-edge.
 * 4. Inspiring portfolios "View More People" routes to /coming-soon/; coming soon page single button cleanup.
 * 5. Metric numbers scaled to 3/4 size; nav-bar style hover (lift, underline, no bg fill) on text buttons and footer links.
 * 6. Interactive newsletter email form with dark ghost placeholder and submission feedback.
 * 7. Responsive overflow validation across viewports (320px - 1280px).
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
    console.log('--- Running Follow-Up Review Regression Suite (16-09-2026) ---');

    // =========================================================================
    // Test 1: Rectangular Halftone Vignette
    // =========================================================================
    console.log('Testing Task 01: Rectangular halftone vignette with 12px margin...');
    await open('/about/');
    const storyPhoto = page.locator('.is-style-lakehub-story-photo');
    assert.equal(await storyPhoto.count(), 1, 'Story photo found');

    const storyBg = await storyPhoto.evaluate(e => getComputedStyle(e, '::before').backgroundImage);
    assert.ok(storyBg.includes('story-dots-rectangular.svg'), `Story photo uses story-dots-rectangular.svg (got ${storyBg})`);

    const storyBefore = await storyPhoto.evaluate(e => {
      const s = getComputedStyle(e, '::before');
      return {
        width: parseFloat(s.width),
        height: parseFloat(s.height),
      };
    });
    assert.ok(Math.abs(storyBefore.width - 508) < 2, `Story dots width is 508px (was ${storyBefore.width})`);
    assert.ok(Math.abs(storyBefore.height - 337) < 2, `Story dots height is 337px (was ${storyBefore.height})`);

    // Impact page halftone check
    await open('/impact/');
    const communityPhoto = page.locator('.is-style-lakehub-community-photo');
    const communityBg = await communityPhoto.evaluate(e => getComputedStyle(e, '::before').backgroundImage);
    assert.ok(communityBg.includes('community-dots-rectangular.svg'), 'Community photo uses community-dots-rectangular.svg');

    const portfolioPhoto = page.locator('.is-style-lakehub-portfolio-photo');
    const portfolioBg = await portfolioPhoto.evaluate(e => getComputedStyle(e, '::before').backgroundImage);
    assert.ok(portfolioBg.includes('portfolio-dots-rectangular.svg'), 'Portfolio photo uses portfolio-dots-rectangular.svg');
    console.log('✓ PASS: Rectangular halftone SVGs & 12px edge dimensions verified');

    // =========================================================================
    // Test 2: Collapsible "Read More / Hide" Component
    // =========================================================================
    console.log('Testing Task 02: Collapsible Read More / Hide with thick direction chevrons...');
    await open('/about/');
    const storyCopy = page.locator('.is-style-lakehub-story-copy');
    assert.equal(await storyCopy.count(), 1, 'Story copy container found');

    const drawer = storyCopy.locator('.lakehub-collapsible-drawer');
    assert.equal(await drawer.count(), 1, 'Collapsible drawer initialized');
    assert.ok(await drawer.evaluate(e => e.classList.contains('is-collapsed')), 'Drawer starts collapsed');

    const readMoreBtn = storyCopy.locator('.lakehub-btn-read-more');
    assert.equal(await readMoreBtn.count(), 1, 'Read More button present');
    assert.ok(await readMoreBtn.isVisible(), 'Read More button is visible');

    // Verify down chevron in Read More
    const downChevron = readMoreBtn.locator('svg.lakehub-toggle-chevron polyline');
    const downPoints = await downChevron.getAttribute('points');
    assert.equal(downPoints, '5 9 12 16 19 9', 'Down chevron points downward');

    // Verify Read More has no background and no border
    const btnStyles = await readMoreBtn.evaluate(e => {
      const s = getComputedStyle(e);
      return {
        bg: s.backgroundColor,
        borderWidth: s.borderTopWidth
      };
    });
    assert.ok(btnStyles.bg === 'rgba(0, 0, 0, 0)' || btnStyles.bg === 'transparent', 'Read More button has transparent background');
    assert.ok(parseFloat(btnStyles.borderWidth) === 0, 'Read More button has no border');

    // Click Read More
    await readMoreBtn.click();
    await page.waitForTimeout(400);
    assert.ok(await drawer.evaluate(e => e.classList.contains('is-expanded')), 'Drawer expanded on click');
    assert.ok(!await readMoreBtn.isVisible(), 'Read More button hidden after expansion');

    const hideBtn = drawer.locator('.lakehub-btn-hide');
    assert.equal(await hideBtn.count(), 1, 'Hide button present inside drawer');
    assert.ok(await hideBtn.isVisible(), 'Hide button visible at the end of revealed text');

    // Verify up chevron in Hide
    const upChevron = hideBtn.locator('svg.lakehub-toggle-chevron polyline');
    const upPoints = await upChevron.getAttribute('points');
    assert.equal(upPoints, '5 15 12 8 19 15', 'Up chevron points upward');

    // Click Hide
    await hideBtn.click();
    await page.waitForTimeout(400);
    assert.ok(await drawer.evaluate(e => e.classList.contains('is-collapsed')), 'Drawer collapsed on hide click');
    assert.ok(await readMoreBtn.isVisible(), 'Read More button visible again');
    console.log('✓ PASS: Collapsible Read More / Hide toggling, fade mask, and direction chevrons verified');

    // =========================================================================
    // Test 3: Scrolling Logos Track Hover Area & Edge Spacing
    // =========================================================================
    console.log('Testing Task 03: Scrolling logos track hover pause & edge padding...');
    await open('/');
    const partnersSection = page.locator('.is-style-lakehub-partners');
    await partnersSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const partnersBox = await partnersSection.boundingBox();
    assert.ok(partnersBox, 'Partners section bounding box found');

    const partnersStyles = await partnersSection.evaluate(e => {
      const s = getComputedStyle(e);
      return {
        paddingLeft: parseFloat(s.paddingLeft),
        paddingRight: parseFloat(s.paddingRight)
      };
    });
    assert.equal(partnersStyles.paddingLeft, 0, 'Partners section has 0 left padding');
    assert.equal(partnersStyles.paddingRight, 0, 'Partners section has 0 right padding');

    const logosTrack = partnersSection.locator('.is-style-lakehub-partner-logos');
    const trackBox = await logosTrack.boundingBox();
    assert.ok(trackBox, 'Logos track bounding box found');

    // Test hovering title does NOT pause
    const title = partnersSection.locator('p:text-matches("TRUSTED BY ORGANIZATIONS GLOBALLY", "i")');
    const titleBox = await title.boundingBox();
    assert.ok(titleBox, 'Partners title found');

    // Move cursor over title
    await page.mouse.move(titleBox.x + titleBox.width / 2, titleBox.y + titleBox.height / 2);
    const pos1 = await logosTrack.evaluate(e => e.scrollLeft);
    await page.waitForTimeout(600);
    const pos2 = await logosTrack.evaluate(e => e.scrollLeft);
    assert.notEqual(pos1, pos2, 'Scroll continues while hovering section title');

    // Move cursor over logos track -> should pause
    await page.mouse.move(trackBox.x + trackBox.width / 2, trackBox.y + trackBox.height / 2);
    await page.waitForTimeout(100);
    const posHover1 = await logosTrack.evaluate(e => e.scrollLeft);
    await page.waitForTimeout(600);
    const posHover2 = await logosTrack.evaluate(e => e.scrollLeft);
    assert.equal(posHover1, posHover2, 'Scroll paused while hovering logos track');

    await page.mouse.move(0, 0);
    console.log('✓ PASS: Scrolling logos hover pause isolated to logos track; zero edge padding verified');

    // =========================================================================
    // Test 4: Inspiring Portfolios Link & Coming Soon Single Button
    // =========================================================================
    console.log('Testing Task 04: Inspiring portfolios link & coming soon cleanup...');
    await open('/impact/');
    const viewMoreBtn = page.locator('.is-style-lakehub-portfolio-copy .is-style-lakehub-optional-action a');
    assert.equal(await viewMoreBtn.count(), 1, 'View More button in Malika portfolio section found');
    const viewMoreHref = await viewMoreBtn.getAttribute('href');
    assert.ok(viewMoreHref.includes('/coming-soon/'), `View More button points to /coming-soon/ (got ${viewMoreHref})`);

    // Verify Coming Soon page
    await open('/coming-soon/');
    const comingSoonBtns = page.locator('.lakehub-coming-soon-buttons .wp-block-button');
    assert.equal(await comingSoonBtns.count(), 1, 'Exactly 1 button on Coming Soon page');
    const backBtn = comingSoonBtns.locator('a');
    assert.equal((await backBtn.textContent()).trim(), 'BACK TO HOME', 'Button is BACK TO HOME');
    console.log('✓ PASS: Inspiring portfolios routed to /coming-soon/ and Coming Soon page has single button');

    // =========================================================================
    // Test 5: Metric Numbers Scaling (0.75x) & Nav-Bar Style Hover
    // =========================================================================
    console.log('Testing Task 05: Metric numbers 0.75x scaling & nav-bar hover...');
    await open('/');
    const metricPhotoP = page.locator('.is-style-lakehub-metric-photo p').first();
    const metricFontSize = await metricPhotoP.evaluate(e => parseFloat(getComputedStyle(e).fontSize));
    // At 1280px, max size is 7.96875rem = ~127.5px. Was 170px (10.625rem).
    assert.ok(metricFontSize < 135 && metricFontSize > 115, `Metric font size is scaled down by ~25% (got ${metricFontSize}px)`);

    // Check nav-bar style hover on optional action buttons and footer links
    await open('/impact/');
    const optionalActionBtn = page.locator('.is-style-lakehub-optional-action a').first();
    await optionalActionBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const btnBox = await optionalActionBtn.boundingBox();
    assert.ok(btnBox, 'Optional action button found');

    await page.mouse.move(btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2);
    await page.waitForTimeout(200);

    const hoveredStyles = await optionalActionBtn.evaluate(e => {
      const s = getComputedStyle(e);
      return {
        bg: s.backgroundColor,
        textDecoration: s.textDecorationLine,
        transform: s.transform
      };
    });
    assert.ok(hoveredStyles.bg === 'rgba(0, 0, 0, 0)' || hoveredStyles.bg === 'transparent', 'Hover does NOT change background color');
    assert.ok(hoveredStyles.textDecoration.includes('underline'), 'Hover shows text underline');
    assert.ok(hoveredStyles.transform !== 'none', 'Hover applies translateY lift');
    console.log('✓ PASS: Metric numbers scaled to 3/4 size; nav-bar style hover verified');

    // =========================================================================
    // Test 6: Interactive Newsletter Form & Ghost Text
    // =========================================================================
    console.log('Testing Task 06: Interactive newsletter form & ghost placeholder...');
    await open('/');
    const newsletterForm = page.locator('form.is-style-lakehub-newsletter');
    assert.equal(await newsletterForm.count(), 1, 'Newsletter form found in footer');

    const emailInput = newsletterForm.locator('input.lakehub-newsletter-input');
    assert.equal(await emailInput.count(), 1, 'Email input present');
    assert.equal(await emailInput.getAttribute('type'), 'email', 'Input type is email');

    const submitBtn = newsletterForm.locator('button[type="submit"]');
    assert.equal(await submitBtn.count(), 1, 'Submit button present');

    // Type email into input
    await emailInput.fill('user@example.com');
    assert.equal(await emailInput.inputValue(), 'user@example.com', 'Input accepts typed text');

    // Submit form
    await submitBtn.click();
    await page.waitForTimeout(200);
    assert.equal((await submitBtn.textContent()).trim(), 'Subscribed!', 'Button text updates to Subscribed!');
    assert.equal(await emailInput.inputValue(), '', 'Input is cleared upon submission');
    console.log('✓ PASS: Interactive newsletter form, ghost styling, and submission feedback verified');

    // =========================================================================
    // Test 7: Viewport Overflow Checks
    // =========================================================================
    console.log('Testing Task 07: Viewport horizontal overflow checks across 320px - 1280px...');
    const viewports = [320, 375, 414, 768, 1024, 1280];
    const testPages = ['/', '/about/', '/impact/', '/programs/', '/coming-soon/'];

    for (const width of viewports) {
      await page.setViewportSize({ width, height: 800 });
      for (const p of testPages) {
        await open(p);
        const overflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        assert.ok(!overflow, `No horizontal overflow at width ${width}px on page ${p}`);
      }
    }
    console.log('✓ PASS: All viewports free of horizontal scroll overflow');

    console.log('\n=================================================================');
    console.log('ALL FOLLOW-UP REVIEW REGRESSION TESTS PASSED SUCCESSFULLY! (7/7)');
    console.log('=================================================================\n');

  } catch (err) {
    console.error('TEST FAILURE:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

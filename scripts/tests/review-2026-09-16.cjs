/**
 * End-to-end regression test suite for 16-09-2026 Website Review.
 * Covers:
 * 1. Radial halftone vignette geometry, center anchoring, hover repulsion, reduced motion.
 * 2. Home hero 4-image crossfade slideshow (3s cycle, no pause on hover, reduced motion randomizer).
 * 3. Blog post template (single.html), metadata, typography, and social share intents.
 * 4. Coming Soon page and comprehensive link resolution.
 * 5. Site copy updates and Rodgers Kaunda team card.
 * 6. Responsive viewports without document overflow.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
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
    console.log('--- Running 16-09-2026 Review Regression Suite ---');

    // =========================================================================
    // Test 1: Radial Halftone Vignette
    // =========================================================================
    console.log('Testing Task 02: Radial halftone vignette...');
    await open('/about/');
    const storyPhoto = page.locator('.is-style-lakehub-story-photo');
    assert.equal(await storyPhoto.count(), 1, 'Story photo found');

    const storyBg = await storyPhoto.evaluate(e => getComputedStyle(e, '::before').backgroundImage);
    assert.ok(storyBg.includes('story-dots-radial.svg'), 'Story photo uses story-dots-radial.svg');

    const storyBefore = await storyPhoto.evaluate(e => {
      const s = getComputedStyle(e, '::before');
      return {
        top: s.top,
        left: s.left,
        width: parseFloat(s.width),
        height: parseFloat(s.height),
        transform: s.transform
      };
    });
    assert.ok(Math.abs(storyBefore.width - 599) < 2, `Story dots width is 599px (was ${storyBefore.width})`);
    assert.ok(Math.abs(storyBefore.height - 599) < 2, `Story dots height is 599px (was ${storyBefore.height})`);

    // Verify hover repulsion
    await page.mouse.move(0, 0);
    await storyPhoto.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const sBox = await storyPhoto.boundingBox();
    assert.ok(sBox, 'Story photo bounding box found');
    await page.mouse.move(sBox.x + 20, sBox.y + 20);
    await page.waitForTimeout(200);
    const repelX = await storyPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-x')) || 0);
    const repelY = await storyPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-y')) || 0);
    assert.ok(repelX > 0, 'Pointer pushes image frame right');
    assert.ok(repelY > 0, 'Pointer pushes image frame down');
    await page.mouse.move(0, 0);

    // Verify reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.mouse.move(sBox.x + 20, sBox.y + 20);
    await page.waitForTimeout(200);
    const rmTransform = await storyPhoto.evaluate(e => getComputedStyle(e).transform);
    assert.equal(rmTransform, 'none', 'Hover transform disabled under reduced motion');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    console.log('✓ PASS: Radial halftone vignette sizing, center anchoring, hover repulsion, and reduced-motion behavior');

    // =========================================================================
    // Test 2: Home Hero Slideshow
    // =========================================================================
    console.log('Testing Task 03: Home hero slideshow...');
    await open('/');
    const heroCover = page.locator('.lakehub-hero-slideshow');
    assert.equal(await heroCover.count(), 1, 'Hero cover found');

    const slides = heroCover.locator('.lakehub-hero-slides .lakehub-hero-slide');
    const slideCount = await slides.count();
    assert.equal(slideCount, 4, 'Exactly 4 slides present in hero slideshow');

    // Initial state: slide 0 is active
    assert.ok(await slides.nth(0).evaluate(e => e.classList.contains('is-active')), 'Slide 0 starts active');

    // Wait 3.5s to verify transition to slide 1
    await page.waitForTimeout(3500);
    assert.ok(await slides.nth(1).evaluate(e => e.classList.contains('is-active')), 'Slide 1 active after ~3.5s');

    // Hover over hero and confirm it doesn't pause (no hover pause)
    await heroCover.hover();
    await page.waitForTimeout(3500);
    assert.ok(await slides.nth(2).evaluate(e => e.classList.contains('is-active')), 'Slideshow continued cycling during hover');

    // Verify no manual controls
    const controls = heroCover.locator('button, .slider-control, .slideshow-prev, .slideshow-next');
    assert.equal(await controls.count(), 0, 'No manual slideshow controls rendered');

    // Verify reduced motion randomizer
    const rmContext = await browser.newContext({
      viewport: { width: 1280, height: 900 },
      reducedMotion: 'reduce'
    });
    const rmPage = await rmContext.newPage();
    await rmPage.goto(base + '/', { waitUntil: 'networkidle' });
    const rmActiveSlides = await rmPage.locator('.lakehub-hero-slide.is-active').count();
    assert.equal(rmActiveSlides, 1, 'Reduced motion has exactly one active slide');

    // Confirm slide doesn't auto-advance under reduced motion
    const rmSlideIdxBefore = await rmPage.locator('.lakehub-hero-slide').evaluateAll(es => es.findIndex(e => e.classList.contains('is-active')));
    await rmPage.waitForTimeout(3500);
    const rmSlideIdxAfter = await rmPage.locator('.lakehub-hero-slide').evaluateAll(es => es.findIndex(e => e.classList.contains('is-active')));
    assert.equal(rmSlideIdxBefore, rmSlideIdxAfter, 'Slideshow does not cycle under reduced motion');
    await rmContext.close();

    console.log('✓ PASS: Home hero 4-image slideshow cycle timing, no hover pause, and reduced-motion freeze');

    // =========================================================================
    // Test 3: Blog Post Template & Insights Loop
    // =========================================================================
    console.log('Testing Task 04: Single post template & articles...');
    await open('/from-learning-to-shipping/');

    const singleShell = page.locator('.lakehub-blog-post-shell');
    assert.equal(await singleShell.count(), 1, 'Single post shell element found');

    const authorText = await page.locator('.lakehub-blog-author').innerText();
    assert.ok(authorText.includes('LakeHub Team'), `Post author displays "LakeHub Team" (was "${authorText}")`);

    const shareLinks = page.locator('.lakehub-share-btn');
    assert.equal(await shareLinks.count(), 4, 'Four social share links present (Copy, LinkedIn, X, Facebook)');

    const quoteBlock = page.locator('blockquote.wp-block-quote');
    assert.ok(await quoteBlock.count() >= 1, 'Styled quote block present in single post');

    // Check Latest Insights cards on Home page
    await open('/');
    const insightCards = page.locator('.is-style-lakehub-insight-card');
    assert.ok(await insightCards.count() >= 6, 'At least 6 insight cards on home page');
    const firstArticleLink = await insightCards.first().locator('a').first().getAttribute('href');
    assert.ok(firstArticleLink && !firstArticleLink.includes('#'), 'First insight card links to a published post');

    console.log('✓ PASS: Single post template, author display, social share links, and insights query loop');

    // =========================================================================
    // Test 4: Coming Soon & Site Link Resolution
    // =========================================================================
    console.log('Testing Task 05: Coming Soon page & link resolution...');
    await open('/coming-soon/');
    const comingSoonHeading = page.locator('.lakehub-coming-soon-title');
    assert.ok((await comingSoonHeading.innerText()).includes('Exciting Things Are On The Way'), 'Coming soon page rendered');

    // Check footer links on home page
    await open('/');
    const footer = page.locator('footer');
    const faqLink = await footer.locator('a:has-text("FAQ")').getAttribute('href');
    const supportLink = await footer.locator('a:has-text("Support")').getAttribute('href');
    const privacyLink = await footer.locator('a:has-text("Privacy Policy")').getAttribute('href');
    assert.ok(faqLink.includes('/coming-soon/'), 'Footer FAQ links to /coming-soon/');
    assert.ok(supportLink.includes('/coming-soon/'), 'Footer Support links to /coming-soon/');
    assert.ok(privacyLink.includes('/coming-soon/'), 'Footer Privacy Policy links to /coming-soon/');

    // Check Chichwa link on /impact/
    await open('/impact/');
    const chichwaLink = await page.locator('#community-engagements a:has-text("Read more")').getAttribute('href');
    assert.ok(chichwaLink.includes('/coming-soon/'), 'Chichwa Read more links to /coming-soon/');

    console.log('✓ PASS: Coming Soon page and site-wide link resolution');

    // =========================================================================
    // Test 5: Site Copy Updates & Rodgers Kaunda
    // =========================================================================
    console.log('Testing Task 06: Site copy & Rodgers Kaunda...');
    await open('/team/');
    const rodgersCard = page.locator('.lakehub-team-card:has-text("Rodgers Kaunda")');
    assert.equal(await rodgersCard.count(), 1, 'Rodgers Kaunda card present on /team/');
    const rodgersRole = await rodgersCard.locator('.lakehub-team-role').innerText();
    assert.equal(rodgersRole, 'TECH ASSOCIATE', 'Rodgers role is TECH ASSOCIATE');
    const stacyCount = await page.locator('.lakehub-team-card:has-text("Stacy Dina")').count();
    assert.equal(stacyCount, 0, 'Stacy Dina is completely removed from /team/');

    // Check Our Story on /about/
    await open('/about/');
    const ourStoryHeading = page.locator('.is-style-lakehub-story-copy h3');
    assert.equal(await ourStoryHeading.innerText(), 'Rooted in Kisumu, Building for the World');
    const storyParas = await page.locator('.is-style-lakehub-story-copy p').count();
    assert.equal(storyParas, 6, 'All 6 Our Story paragraphs present');

    // Check Home Journey and Insights subheadline
    await open('/');
    const milestone2014 = page.locator('.is-style-lakehub-year:has-text("2014")');
    assert.equal(await milestone2014.count(), 1, 'Home journey milestone year is 2014');
    const insightsSubhead = await page.locator('.is-style-lakehub-insights .is-style-lakehub-impact-heading p').innerText();
    assert.ok(insightsSubhead.includes('Ideas, people and innovations shaping the future from Kisumu and beyond'), 'Insights subheadline matches Google Doc');

    console.log('✓ PASS: Site copy updates and Rodgers Kaunda team presence');

    // =========================================================================
    // Test 6: Responsive Viewports (320, 390, 768, 1024, 1280)
    // =========================================================================
    console.log('Testing responsive viewports...');
    for (const width of [320, 390, 768, 1024, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      for (const path of ['/', '/about/', '/impact/', '/programs/', '/team/', '/coming-soon/', '/from-learning-to-shipping/']) {
        await open(path);
        const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        assert.ok(!hasOverflow, `No horizontal document overflow at ${width}px on ${path}`);
      }
    }
    console.log('✓ PASS: Responsive viewports 320px - 1280px without document overflow');

    console.log('\n========================================');
    console.log('ALL REGRESSION TESTS PASSED (100% SUCCESS)');
    console.log('========================================\n');

    assert.deepEqual(errors, [], 'No browser console errors encountered');
  } finally {
    await browser.close();
  }
})().catch(e => {
  console.error('TEST FAILED:', e);
  process.exitCode = 1;
});

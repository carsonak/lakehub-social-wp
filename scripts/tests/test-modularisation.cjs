/**
 * Automated Regression Test: Modularised CSS & JS Verification.
 */
const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('Running modularisation regression test...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });
  page.on('response', (response) => {
    if (response.status() >= 400) {
      console.log(`HTTP ${response.status()}: ${response.url()}`);
    }
  });

  // Test 1: Home Page
  console.log('Testing Home page (http://localhost:8881/)...');
  await page.goto('http://localhost:8881/', { waitUntil: 'networkidle' });

  const homeStyles = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.id);
    return {
      hasNav: links.includes('lakehub-navigation-css'),
      hasFooter: links.includes('lakehub-footer-css'),
      hasSections: links.includes('lakehub-sections-css'),
      hasPartners: links.includes('lakehub-partners-css'),
      hasInsights: links.includes('lakehub-insights-css'),
      hasSinglePost: links.includes('lakehub-single-post-css'),
    };
  });

  assert(homeStyles.hasNav, 'Home must load lakehub-navigation-css');
  assert(homeStyles.hasFooter, 'Home must load lakehub-footer-css');
  assert(homeStyles.hasSections, 'Home must load lakehub-sections-css');
  assert(homeStyles.hasPartners, 'Home must load lakehub-partners-css');
  assert(homeStyles.hasInsights, 'Home must load lakehub-insights-css');
  assert(!homeStyles.hasSinglePost, 'Home must NOT load lakehub-single-post-css');
  console.log('✓ Home page modular stylesheets confirmed.');

  // Test 2: Home Page Interactive Behaviors
  const homeBehaviors = await page.evaluate(() => {
    const partnerTrack = document.querySelector('.is-style-lakehub-partner-logos');
    const partnerRegion = partnerTrack?.getAttribute('role');
    const heroSlide = document.querySelector('.lakehub-hero-slide.is-active');
    const insightsControls = document.querySelector('.lakehub-insights-controls');
    return {
      partnerRegion,
      hasActiveSlide: !!heroSlide,
      hasInsightsControls: !!insightsControls,
    };
  });

  assert.strictEqual(homeBehaviors.partnerRegion, 'region', 'Partner track must be initialized with role=region');
  assert(homeBehaviors.hasActiveSlide, 'Hero slideshow must have an active slide');
  console.log('✓ Home page carousel and slideshow modules initialized.');

  // Test 3: Single Blog Post
  console.log('Testing Single Post page (http://localhost:8881/from-learning-to-shipping/)...');
  await page.goto('http://localhost:8881/from-learning-to-shipping/', { waitUntil: 'networkidle' });

  const singlePostInfo = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.id);
    const shareLinks = document.querySelector('.lakehub-social-share-links');
    const xBtn = shareLinks?.querySelector('.share-x');
    return {
      hasSingleCss: links.includes('lakehub-single-post-css'),
      hasShareLinks: !!shareLinks,
      xHref: xBtn?.getAttribute('href') || '',
    };
  });

  assert(singlePostInfo.hasSingleCss, 'Single post must load lakehub-single-post-css');
  assert(singlePostInfo.hasShareLinks, 'Single post must render share container');
  assert(singlePostInfo.xHref.includes('twitter.com/intent/tweet'), 'X share button must have configured twitter share URL');
  console.log('✓ Single post template styles and share module confirmed.');

  // Test 4: Verify zero console errors
  assert.strictEqual(consoleErrors.length, 0, `Expected 0 console errors, got: ${consoleErrors.join(', ')}`);
  console.log('✓ Zero browser console errors detected.');

  await browser.close();
  console.log('All modularisation regression tests PASSED successfully!');
})();

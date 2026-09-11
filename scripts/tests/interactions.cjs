/** Public-page checks; no WordPress records are changed.
 * LAKEHUB_TEST_URL=http://127.0.0.1:8080 node scripts/tests/interactions.cjs
 * Requires Playwright; optionally set CHROMIUM_PATH to a local browser binary.
 */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const base = process.env.LAKEHUB_TEST_URL || 'http://127.0.0.1:8080';
const themeScript = 'wp-content/themes/lakehub-social/assets/js/main.js';
const trackSelector = '.is-style-lakehub-partner-logos';

(async () => {
  const browser = await chromium.launch({headless: true, ...(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {}), args: ['--no-sandbox']});
  const errors = [];
  const context = await browser.newContext({viewport: {width: 1280, height: 900}});
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const open = async path => {
    await page.goto(base + path, {waitUntil: 'domcontentloaded'});
    await page.waitForFunction(() => document.fonts.status === 'loaded');
  };
  try {
    await open('/');
    const track = page.locator(trackSelector);
    await track.scrollIntoViewIfNeeded();
    await page.waitForFunction(selector => document.querySelector(selector)?.children.length === 15, trackSelector);
    const left = () => track.evaluate(element => element.scrollLeft);
    const start = await left();
    await page.waitForFunction(({selector, start}) => document.querySelector(selector).scrollLeft > start + 8, {selector: trackSelector, start}, {timeout: 5000});
    assert.ok(await left() > start + 8, 'Autoplay moves left at a gentle pace');
    await track.hover();
    const hovered = await left();
    await page.waitForTimeout(300);
    assert.equal(await left(), hovered, 'Hover pauses autoplay');

    const bounds = await track.boundingBox();
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await page.mouse.down();
    await page.mouse.move(bounds.x + bounds.width / 2 - 120, bounds.y + bounds.height / 2, {steps: 8});
    await page.mouse.up();
    assert.ok(await left() > hovered + 90, 'Dragging moves the carousel');
    assert.equal(page.url(), base + '/', 'Dragging a linked logo does not navigate');

    await track.focus();
    const focused = await left();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    assert.ok(await left() > focused + 100, 'ArrowRight advances one logo');
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(500);
    assert.ok(Math.abs(await left() - focused) < 3, 'ArrowLeft reverses one logo');
    const held = await left();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(300);
    assert.equal(await left(), held, 'Keyboard focus pauses autoplay');
    assert.equal(await track.locator('[data-lakehub-repeat] a:not([tabindex="-1"])').count(), 0);
    assert.equal(await track.locator('[data-lakehub-repeat]:not([aria-hidden="true"])').count(), 0);
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => !!document.activeElement.closest('[data-lakehub-repeat]')), false, 'Tab skips visual repeats');
    const focusedLogo = page.locator('.is-style-lakehub-partner-logo:focus-within img');
    await page.waitForTimeout(240);
    assert.match(await focusedLogo.evaluate(element => getComputedStyle(element).filter), /^drop-shadow/, 'Focused logo restores source colours');

    assert.equal(await page.locator('.lakehub-partners-toggle').count(), 0, 'No pause/play control');
    await page.emulateMedia({reducedMotion: 'reduce'});
    const reduced = await left();
    await page.waitForTimeout(350);
    assert.equal(await left(), reduced, 'Reduced motion stops autoplay');
    assert.equal(await page.locator('.lakehub-partners-toggle').count(), 0);
    await track.focus();
    await page.keyboard.press('ArrowRight');
    assert.notEqual(await left(), reduced, 'Manual navigation remains available with reduced motion');

    await page.evaluate(() => document.activeElement.blur());
    const cycle = await track.evaluate(track => track.querySelector(':scope > :not([data-lakehub-repeat])').getBoundingClientRect().left - track.firstElementChild.getBoundingClientRect().left);
    await track.evaluate((track, cycle) => { track.scrollLeft = cycle * 2 + 35; }, cycle);
    await page.waitForTimeout(100);
    assert.ok(Math.abs(await left() - cycle - 35) < 2, 'Right loop boundary is seamless');
    await track.evaluate((track, cycle) => { track.scrollLeft = cycle - 35; }, cycle);
    await page.waitForTimeout(100);
    assert.ok(Math.abs(await left() - (cycle * 2 - 35)) < 2, 'Left loop boundary is seamless');

    await page.emulateMedia({reducedMotion: 'no-preference'});
    const milestone = page.locator('.is-style-lakehub-milestone').first();
    await milestone.hover();
    await page.waitForTimeout(250);
    assert.match(await milestone.evaluate(element => getComputedStyle(element, '::after').transform), /1\.2/);
    assert.equal(await page.locator('.is-style-lakehub-milestone').nth(1).evaluate(element => getComputedStyle(element, '::after').transform), 'none');
    const outline = page.locator('.is-style-lakehub-home-photo .is-style-outline a[href]').first();
    await outline.hover();
    await page.waitForTimeout(250);
    assert.deepEqual(await outline.evaluate(element => ({background: getComputedStyle(element).backgroundColor, color: getComputedStyle(element).color})), {background: 'rgb(255, 255, 255)', color: 'rgb(0, 103, 107)'});
    const nav = page.locator('header nav a').first();
    await nav.hover();
    await page.waitForTimeout(250);
    assert.equal(await nav.evaluate(element => getComputedStyle(element).fontWeight), '500');
    assert.match(await nav.evaluate(element => getComputedStyle(element).transform), /-2\)/);

    await open('/programs/');
    const card = page.locator('.lakehub-program').nth(1);
    await card.hover();
    await page.waitForTimeout(250);
    assert.equal(await card.evaluate(element => element.classList.contains('has-glare')), true);
    assert.equal(await card.evaluate(element => getComputedStyle(element, '::after').pointerEvents), 'none');
    await page.emulateMedia({reducedMotion: 'reduce'});
    assert.equal(await card.evaluate(element => element.classList.contains('has-glare')), false);
    assert.equal(await card.evaluate(element => getComputedStyle(element, '::after').display), 'none');
    for (const width of [320, 390, 768, 1024, 1280, 1440]) {
      await page.setViewportSize({width, height: 900});
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Programs has no overflow at ${width}px`);
      const backgrounds = await page.locator('.lakehub-program').evaluateAll(cards => cards.map(element => {
        const css = getComputedStyle(element);
        return [css.backgroundSize, css.backgroundRepeat, css.backgroundPosition];
      }));
      assert.ok(backgrounds.every(values => JSON.stringify(values) === JSON.stringify(['100% 100%', 'no-repeat', '50% 100%'])), `Gradients fill every card at ${width}px`);
    }
    await open('/');
    for (const width of [320, 390, 768, 1024, 1280, 1440]) {
      await page.setViewportSize({width, height: 900});
      await page.waitForTimeout(100);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Home has no overflow at ${width}px`);
    }

    // A shorter client-edited collection needs no autoplay or copies until it overflows.
    const short = await context.newPage();
    await short.route('**/assets/js/main.js*', route => route.fulfill({body: '', contentType: 'application/javascript'}));
    await short.goto(base + '/', {waitUntil: 'domcontentloaded'});
    await short.locator(trackSelector).evaluate(track => Array.from(track.children).slice(3).forEach(logo => logo.remove()));
    await short.addScriptTag({path: themeScript});
    await short.waitForTimeout(150);
    assert.equal(await short.locator('[data-lakehub-repeat]').count(), 0);
    assert.equal(await short.locator('.lakehub-partners-toggle').count(), 0);
    await short.setViewportSize({width: 390, height: 844});
    await short.waitForTimeout(150);
    assert.equal(await short.locator('[data-lakehub-repeat]').count(), 6);
    await short.setViewportSize({width: 1280, height: 900});
    await short.waitForTimeout(150);
    assert.equal(await short.locator('[data-lakehub-repeat]').count(), 0);
    await short.close();

    const noJS = await browser.newContext({javaScriptEnabled: false, viewport: {width: 390, height: 844}});
    const fallback = await noJS.newPage();
    await fallback.goto(base + '/', {waitUntil: 'domcontentloaded'});
    assert.equal(await fallback.locator(`${trackSelector} > figure`).count(), 5);
    assert.equal(await fallback.locator('.lakehub-partners-toggle').count(), 0);
    await noJS.close();

    const touchContext = await browser.newContext({viewport: {width: 390, height: 844}, hasTouch: true, isMobile: true, reducedMotion: 'reduce'});
    const touch = await touchContext.newPage();
    await touch.goto(base + '/', {waitUntil: 'domcontentloaded'});
    const touchTrack = touch.locator(trackSelector);
    await touchTrack.scrollIntoViewIfNeeded();
    const touchBounds = await touchTrack.boundingBox();
    const session = await touchContext.newCDPSession(touch);
    const swipe = async (dx, dy) => {
      const x = touchBounds.x + touchBounds.width / 2, y = touchBounds.y + touchBounds.height / 2;
      await session.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x, y, id: 1}]});
      for (let step = 1; step <= 8; step++) {
        await session.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: x + dx * step / 8, y: y + dy * step / 8, id: 1}]});
      }
      await session.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
    };
    const touchStart = await touchTrack.evaluate(track => track.scrollLeft);
    await swipe(-100, 0);
    assert.ok(await touchTrack.evaluate(track => track.scrollLeft) > touchStart + 70, 'Touch swipe moves logos');
    const scrollStart = await touch.evaluate(() => scrollY);
    await swipe(0, -100);
    await touch.waitForTimeout(200);
    assert.ok(await touch.evaluate(() => scrollY) > scrollStart + 30, 'Vertical swipes still scroll the page');
    // Prevent any external request while verifying a normal partner-link click.
    await touch.route('https://www.giz.de/**', route => route.fulfill({body: 'Partner destination test'}));
    await touch.locator(`${trackSelector} > :not([data-lakehub-repeat]) a`).first().click();
    await touch.waitForURL('https://www.giz.de/en/');
    await touchContext.close();
    assert.deepEqual(errors, []);
    console.log('PASS: carousel autoplay/drag/keyboard/pause/looping, touch swipes and partner links, logo focus, hover effects, reduced motion, responsive gradients, changing collection size, and no-JS fallback.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

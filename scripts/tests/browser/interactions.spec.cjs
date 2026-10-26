const { test, expect } = require('@playwright/test');

const pages = ['/', '/about/', '/team/', '/programs/', '/impact/', '/coming-soon/', '/from-learning-to-shipping/'];
async function open(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.wp-site-blocks')).toBeVisible();
}
const style = (locator, property) => locator.evaluate((element, property) => getComputedStyle(element)[property], property);

for (const width of [1280, 768, 390]) {
  for (const url of pages) {
    test(`${width}px ${url} has intact layout, images and assets`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('response', (response) => { if (response.status() >= 400 && response.url().startsWith(new URL(page.url()).origin)) errors.push(`${response.status()} ${response.url()}`); });
      await open(page, url);
      // Decode originals throughout the page before inspecting offscreen content.
      await page.locator('img').evaluateAll((images) => images.forEach((image) => { image.loading = 'eager'; }));
      await expect.poll(() => page.locator('img').evaluateAll((images) => images.filter((image) => !image.complete || !image.naturalWidth).map((image) => image.getAttribute('src')))).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      // Generic page.html adds a title above Coming Soon's existing content heading.
      if (url !== '/coming-soon/') await expect(page.locator('h1')).toHaveCount(1);
      else await expect(page.locator('.lakehub-coming-soon-title')).toBeVisible();
      if (url === '/') {
        const track = page.locator('.wp-block-query.is-style-lakehub-insights .wp-block-post-template');
        expect(await style(track, 'display')).toBe('flex');
        const geometry = await track.evaluate((element) => ({ track: element.clientWidth, card: element.firstElementChild.getBoundingClientRect().width, gap: parseFloat(getComputedStyle(element).columnGap) }));
        const visible = width > 900 ? 3 : width > 600 ? 2 : 1;
        expect(Math.abs(geometry.track - (geometry.card * visible + geometry.gap * (visible - 1)))).toBeLessThan(2);
        expect(await style(page.locator('.is-style-lakehub-partner-logos'), 'flexWrap')).toBe('nowrap');
      }
      if (url === '/coming-soon/') {
        const gap = await page.evaluate(() => document.querySelector('.lakehub-coming-soon-buttons').getBoundingClientRect().top - document.querySelector('.lakehub-coming-soon-desc').getBoundingClientRect().bottom);
        expect(gap).toBeGreaterThanOrEqual(16);
      }
      expect(errors).toEqual([]);
    });
  }
}

test('Insights buttons and keyboard move the viewport and respect boundaries', async ({ page }) => {
  await open(page, '/');
  const track = page.locator('.wp-block-query.is-style-lakehub-insights .wp-block-post-template');
  const next = page.getByRole('button', { name: 'Next insight', exact: true });
  const previous = page.getByRole('button', { name: 'Previous insight', exact: true });
  await expect(previous).toBeDisabled();
  await next.click();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(100);
  await expect(previous).toBeEnabled();
  await track.focus();
  await page.keyboard.press('End');
  await expect(next).toBeDisabled();
  await page.keyboard.press('Home');
  await expect(previous).toBeDisabled();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeLessThan(2);
});

test('Partner logos continuously move, pause on hover, and support keys and dragging', async ({ page }) => {
  await open(page, '/');
  const track = page.locator('.is-style-lakehub-partner-logos');
  await track.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  const start = await track.evaluate((element) => element.scrollLeft);
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).not.toBe(start);
  await track.hover();
  const paused = await track.evaluate((element) => element.scrollLeft);
  await page.waitForTimeout(200);
  expect(await track.evaluate((element) => element.scrollLeft)).toBe(paused);
  await track.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).not.toBe(paused);
  const box = await track.boundingBox();
  const before = await track.evaluate((element) => element.scrollLeft);
  await page.mouse.move(box.x + box.width * .7, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .3, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  expect(Math.abs(await track.evaluate((element) => element.scrollLeft) - before)).toBeGreaterThan(50);
  await expect(track).not.toHaveClass(/is-dragging/);
});

test('Journey milestones emphasize on hover and support drag/keyboard at narrow widths', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await open(page, '/');
  const track = page.locator('.is-style-lakehub-timeline');
  const milestone = track.locator('.is-style-lakehub-milestone').first();
  await milestone.hover();
  await expect.poll(() => style(milestone.locator('h3'), 'transform')).not.toBe('none');
  await track.focus();
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(50);
  await track.evaluate((element) => element.scrollTo({ left: 0, behavior: 'instant' }));
  const box = await track.boundingBox();
  await page.mouse.move(box.x + box.width * .8, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * .3, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect.poll(() => track.evaluate((element) => element.scrollLeft)).toBeGreaterThan(50);
  await expect(track).not.toHaveClass(/is-dragging/);
});

test('Outline fill, image zoom and footer hover feedback are restored', async ({ page }) => {
  await open(page, '/');
  const outline = page.locator('.is-style-outline .wp-block-button__link').first();
  await outline.hover();
  await expect(outline).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect.poll(() => style(outline, 'transform')).not.toBe('none');
  const card = page.locator('.is-style-lakehub-insight-card').first();
  await card.hover();
  await expect.poll(() => style(card.locator('img'), 'transform')).toContain('1.045');
  const link = page.locator('.is-style-lakehub-footer-bottom a').first();
  await link.hover();
  await expect(link).toHaveCSS('text-decoration-line', 'underline');
  await expect.poll(() => style(link, 'transform')).not.toBe('none');
  const social = page.locator('.is-style-lakehub-social-icon a').first();
  await social.hover();
  await expect(social.locator('img')).toHaveCSS('opacity', '1');
  await expect.poll(() => style(social.locator('img'), 'filter')).toContain('1.35');
});

test('Header uses one moving underline and restores the current page on exit', async ({ page }) => {
  await open(page, '/');
  const nav = page.locator('header .wp-block-navigation');
  const links = nav.locator('.wp-block-navigation__container > li > a');
  const indicator = nav.locator('.lakehub-nav-indicator');
  const current = nav.locator('a[aria-current="page"]');
  await expect(indicator).toBeVisible();
  const original = await indicator.evaluate((element) => element.style.transform);
  await links.nth(1).hover();
  await expect.poll(() => indicator.evaluate((element) => element.style.transform)).not.toBe(original);
  await expect(current).toHaveCSS('border-bottom-color', 'rgba(0, 0, 0, 0)');
  await expect(links.nth(1)).toHaveClass(/is-nav-highlighted/);
  await page.mouse.move(0, 500);
  await expect.poll(() => indicator.evaluate((element) => element.style.transform)).toBe(original);
  await links.nth(1).focus();
  await page.keyboard.press('Tab');
  await expect(links.nth(2)).toHaveClass(/is-nav-highlighted/);
  await expect(links.nth(2)).toHaveCSS('outline-style', 'solid');
});

test('Mission collage zoom preserves rotation; story expands and collapses', async ({ page }) => {
  await open(page, '/about/');
  const figure = page.locator('.is-style-lakehub-mission-collage figure').first();
  await figure.hover();
  await expect.poll(() => style(figure.locator('img'), 'transform')).toContain('0.738927');
  const read = page.locator('.lakehub-btn-read-more').first();
  await read.click();
  await expect(page.locator('.lakehub-collapsible-drawer').first()).toHaveClass(/is-expanded/);
  await page.locator('.lakehub-btn-hide').first().click();
  await expect(page.locator('.lakehub-collapsible-drawer').first()).toHaveClass(/is-collapsed/);
});

test('Team sheen follows pointer, resets, and original Alpha crop is applied', async ({ page }) => {
  await open(page, '/team/');
  const card = page.locator('.lakehub-team-card').first();
  const box = await card.boundingBox();
  await page.mouse.move(box.x + box.width * .25, box.y + box.height * .25);
  await expect(card).toHaveClass(/has-sheen/);
  const before = await card.evaluate((element) => element.style.getPropertyValue('--lakehub-sheen-x'));
  await page.mouse.move(box.x + box.width * .75, box.y + box.height * .5);
  await expect.poll(() => card.evaluate((element) => element.style.getPropertyValue('--lakehub-sheen-x'))).not.toBe(before);
  await page.mouse.move(0, 100);
  await expect(card).not.toHaveClass(/has-sheen/);
  const alpha = page.locator('.lakehub-team-card').filter({ has: page.getByRole('heading', { name: 'Alpha Omondi' }) });
  const photo = alpha.locator('.lakehub-team-photo');
  await expect(photo).toHaveClass(/has-design-crop/);
  await expect(photo.locator('img')).toHaveCSS('position', 'absolute');
  const crop = await photo.evaluate((element) => { const image = element.querySelector('img'); return { actual: getComputedStyle(image).top, saved: getComputedStyle(element).getPropertyValue('--lakehub-crop-top') }; });
  expect(parseFloat(crop.actual)).toBeLessThan(0);
  expect(crop.saved).not.toBe('');
});

test('Program cards reveal and track glare; metrics reveal in both directions', async ({ page }) => {
  await open(page, '/programs/');
  const program = page.locator('.lakehub-program').first();
  await program.scrollIntoViewIfNeeded();
  await expect(program).toHaveClass(/is-card-visible/);
  await program.hover();
  await expect(program).toHaveClass(/has-glare/);
  await page.mouse.move(0, 0);
  await expect(program).not.toHaveClass(/has-glare/);
  await open(page, '/');
  const row = page.locator('.is-style-lakehub-metric-row').first();
  await row.scrollIntoViewIfNeeded();
  await expect(row).toHaveClass(/is-revealed/);
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect(row).not.toHaveClass(/is-revealed/);
  await row.scrollIntoViewIfNeeded();
  await expect(row).toHaveClass(/is-revealed/);
});

test('Halftone pointer displacement and transformation hover remain working', async ({ page }) => {
  await open(page, '/about/');
  const photo = page.locator('.is-style-lakehub-story-photo');
  await photo.scrollIntoViewIfNeeded();
  await expect(photo.locator('.lakehub-halftone-layer svg')).toBeAttached();
  const box = await photo.boundingBox();
  await page.mouse.move(box.x + box.width * .75, box.y + box.height * .75);
  await expect.poll(() => photo.evaluate((element) => element.style.getPropertyValue('--lakehub-repel-x'))).not.toBe('0px');
  await page.mouse.move(0, 0);
  await expect.poll(() => photo.evaluate((element) => element.style.getPropertyValue('--lakehub-repel-x'))).toBe('0px');
  await open(page, '/impact/');
  const grid = page.locator('.is-style-lakehub-transformation-grid');
  await grid.scrollIntoViewIfNeeded();
  const circle = grid.locator('.is-style-lakehub-transformation-card').first();
  await circle.hover();
  await expect.poll(() => circle.evaluate((element) => parseFloat(element.style.getPropertyValue('--lakehub-circle-scale')))).toBeGreaterThan(1);
  await page.mouse.move(0, 0);
  await expect.poll(() => circle.evaluate((element) => element.style.getPropertyValue('--lakehub-circle-scale'))).toBe('1');
});

test('Slideshow advances, share URLs work, and dynamic external links preserve rel', async ({ page }) => {
  await open(page, '/');
  const initial = await page.locator('.lakehub-hero-slide.is-active').getAttribute('src');
  await expect.poll(() => page.locator('.lakehub-hero-slide.is-active').getAttribute('src'), { timeout: 5000 }).not.toBe(initial);
  const rel = await page.evaluate(() => {
    const link = document.createElement('a');
    link.href = 'https://example.invalid/'; link.rel = 'nofollow'; document.body.append(link);
    document.addEventListener('click', (event) => event.preventDefault(), { once: true });
    link.click(); const result = { target: link.target, rel: link.rel }; link.remove(); return result;
  });
  expect(rel.target).toBe('_blank');
  expect(rel.rel.split(' ')).toEqual(expect.arrayContaining(['nofollow', 'noopener', 'noreferrer']));
  await open(page, '/from-learning-to-shipping/');
  await expect(page.locator('.share-x')).toHaveAttribute('href', /twitter.com\/intent\/tweet/);
  await expect(page.locator('.share-linkedin')).toHaveAttribute('href', /linkedin.com\/sharing/);
});

test('Reduced motion stops autoplay and sheen while keeping browsing and focus usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, '/');
  const logos = page.locator('.is-style-lakehub-partner-logos');
  await logos.scrollIntoViewIfNeeded();
  const before = await logos.evaluate((element) => element.scrollLeft);
  await page.waitForTimeout(250);
  expect(await logos.evaluate((element) => element.scrollLeft)).toBe(before);
  const outline = page.locator('.is-style-outline .wp-block-button__link').first();
  await outline.hover();
  await expect(outline).toHaveCSS('transform', 'none');
  await expect(outline).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.getByRole('button', { name: 'Next insight', exact: true }).click();
  expect(await page.locator('.wp-block-post-template').evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  await open(page, '/team/');
  const card = page.locator('.lakehub-team-card').first();
  await card.hover();
  await expect(card).not.toHaveClass(/has-sheen/);
});

test('Mobile menu opens and closes with keyboard without a desktop indicator', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, '/');
  await page.locator('header .wp-block-navigation__responsive-container-open').click();
  await expect(page.locator('header .wp-block-navigation__responsive-container')).toHaveClass(/is-menu-open/);
  await expect(page.locator('.lakehub-nav-indicator')).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(page.locator('header .wp-block-navigation__responsive-container')).not.toHaveClass(/is-menu-open/);
});

const { test, expect } = require('@playwright/test');

// Reference values come from docs/design-cache/2026-10-29, at 1280px.
async function typography(locator, size, weight, family, line) {
  const style = await locator.first().evaluate(el => {
    const s = getComputedStyle(el);
    return { size: parseFloat(s.fontSize), weight: s.fontWeight, family: s.fontFamily, line: parseFloat(s.lineHeight) };
  });
  expect(style.size).toBeCloseTo(size, 1);
  expect(style.weight).toBe(String(weight));
  expect(style.family).toContain(family);
  expect(style.line).toBeCloseTo(line, 1);
}

test('Home statistics restore the reference scale without changing their values', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const figures = page.locator('.is-style-lakehub-metric-photo p');
  await expect(figures).toHaveText(['350+', '45+', '88%', '14']);
  await typography(figures, 170, 800, 'Hanken Grotesk', 170.0085);
  await typography(figures.nth(1), 170, 800, 'Inter', 170.0085);
  await typography(page.locator('.is-style-lakehub-impact-stats > h2'), 32, 700, 'Hanken Grotesk', 52);
});

test('Programs use the reference heading and card typefaces', async ({ page }) => {
  await page.goto('/programs/');
  await page.evaluate(() => document.fonts.ready);
  await typography(page.locator('.is-style-lakehub-program-section > h2'), 32, 600, 'Inter', 40);
  await typography(page.locator('.lakehub-program-copy :is(h2,h3)'), 36, 600, 'Hanken Grotesk', 42);
  await typography(page.locator('.lakehub-program-description p'), 16, 400, 'Hanken Grotesk', 25);
});

test('About headings and team names restore the reference hierarchy', async ({ page }) => {
  await page.goto('/about/');
  await page.evaluate(() => document.fonts.ready);
  await typography(page.locator('.is-style-lakehub-about-intro h2'), 36, 700, 'Inter', 56);
  await typography(page.locator('.is-style-lakehub-about-mission > h2'), 36, 600, 'Inter', 40);
  await typography(page.locator('.is-style-lakehub-mission-copy h3'), 32, 600, 'Inter', 50);
  await typography(page.locator('.lakehub-team-copy h3'), 20, 600, 'Inter', 28);
  await typography(page.locator('.lakehub-team-bio'), 14, 400, 'Inter', 20);
});

test('Impact retains the updated portrait while matching reference typography', async ({ page }) => {
  await page.goto('/impact/');
  await page.evaluate(() => document.fonts.ready);
  await typography(page.locator('.is-style-lakehub-impact-community h2'), 32, 700, 'Inter', 40);
  await typography(page.locator('.is-style-lakehub-impact-transformation h2'), 36, 700, 'Hanken Grotesk', 52);
  await typography(page.locator('.is-style-lakehub-transformation-card h3'), 24, 700, 'Hanken Grotesk', 24);
  await typography(page.locator('.is-style-lakehub-transformation-card p'), 16, 400, 'Hanken Grotesk', 20);
  await expect(page.locator('.is-style-lakehub-portfolio-photo img')).toHaveAttribute('src', /malika-1\.jpg/);
});

test('Articles load local Roboto and retain a full reading measure', async ({ page }) => {
  const externalFonts = [];
  page.on('request', request => { if (/fonts\.(googleapis|gstatic)\.com/.test(request.url())) externalFonts.push(request.url()); });
  await page.goto('/from-learning-to-shipping/');
  await page.evaluate(() => document.fonts.ready);
  await typography(page.locator('.lakehub-blog-title'), 48, 700, 'Roboto', 57.6);
  await typography(page.locator('.lakehub-blog-body h2'), 40, 700, 'Roboto', 48);
  await typography(page.locator('.lakehub-blog-body .wp-block-post-content > p'), 16, 400, 'Hanken Grotesk', 24);
  const laterParagraph = page.locator('.lakehub-blog-body .wp-block-post-content > h2 ~ h2 ~ p');
  await typography(laterParagraph, 16, 400, 'Roboto', 24);
  await typography(page.locator('.lakehub-blog-body blockquote p'), 20, 400, 'Inter', 28);
  expect(await page.evaluate(async () => (await document.fonts.load('700 48px Roboto')).some(face => face.status === 'loaded'))).toBe(true);
  const measure = await page.locator('.lakehub-blog-body .wp-block-post-content').evaluate(el => el.getBoundingClientRect().width);
  expect(measure).toBeCloseTo(768, 0);
  expect(externalFonts).toEqual([]);
});

for (const width of [320, 1024, 1440]) {
  test(`changed typography fits all affected pages at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const path of ['/', '/programs/', '/about/', '/impact/', '/from-learning-to-shipping/', '/coming-soon/']) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(2);
      for (const el of await page.locator('.lakehub-program-description, .is-style-lakehub-mission-copy h3, .lakehub-team-copy h3, .lakehub-blog-title, .lakehub-blog-body .wp-block-post-content').all()) {
        const fits = await el.evaluate(e => e.scrollWidth <= e.clientWidth + 1);
        expect(fits, path).toBe(true);
      }
    }
  });
}

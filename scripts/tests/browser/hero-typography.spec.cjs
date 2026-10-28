const { test, expect } = require('@playwright/test');

const banners = [
  ['/', '.is-style-lakehub-home-photo', 76, '800', 70 / 76, { x: 286, y: 140, width: 724, coverHeight: 538 }],
  ['/programs/', '.is-style-lakehub-programs-photo', 56, '800', 1.25, { x: 64, y: 188, width: 1152, coverHeight: 572 }],
  ['/about/', '.is-style-lakehub-about-hero', 56, '700', 1, { x: 108, y: 186.5, width: 1064, coverHeight: 429 }],
  ['/impact/', '.is-style-lakehub-impact-hero', 56, '700', 52 / 56, { x: 299, y: 166, width: 672, coverHeight: 480 }],
];

for (const width of [1440, 1280, 1024, 768, 390, 320]) {
  test(`photo heroes match their references and fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const [path, selector, size, weight, ratio, geometry] of banners) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const hero = page.locator(selector).first();
      const heading = hero.locator('h1');
      await expect(heading).toBeVisible();
      const metrics = await heading.evaluate(el => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const cover = el.closest('.wp-block-cover').getBoundingClientRect();
        return {
          size: parseFloat(style.fontSize), weight: style.fontWeight,
          lineHeight: parseFloat(style.lineHeight),
          fits: el.scrollWidth <= el.clientWidth + 1 && rect.left >= cover.left && rect.right <= cover.right + 1 && rect.top >= cover.top && rect.bottom <= cover.bottom + 1,
          spans: [...el.querySelectorAll('span')].map(span => ({ size: parseFloat(getComputedStyle(span).fontSize), weight: getComputedStyle(span).fontWeight })),
          bottom: rect.bottom,
          x: rect.x - cover.x, y: rect.y - cover.y, width: rect.width, coverHeight: cover.height,
        };
      });
      expect(metrics.weight, path).toBe(weight);
      expect(metrics.lineHeight / metrics.size, path).toBeCloseTo(width > 900 ? ratio : 1.1, 2);
      if (width === 1280) {
        expect(metrics.size, path).toBeCloseTo(size, 2);
        for (const [key, target] of Object.entries(geometry)) {
          expect(Math.abs(metrics[key] - target), `${path}: ${key}`).toBeLessThanOrEqual(1);
        }
      }
      expect(metrics.fits, path).toBe(true);
      for (const span of metrics.spans) {
        expect(span.size).toBe(metrics.size);
        expect(span.weight).toBe(metrics.weight);
      }
      for (const button of await hero.locator('.wp-block-button').all()) {
        const box = await button.boundingBox();
        expect(box.y, path).toBeGreaterThanOrEqual(metrics.bottom);
      }
      if ([1280, 390].includes(width)) {
        await hero.screenshot({ path: `.runtime/hero-typography/${path.replaceAll('/', '') || 'home'}-${width}.png` });
      }
    }
  });
}

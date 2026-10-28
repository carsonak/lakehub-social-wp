const { test, expect } = require('@playwright/test');

const banners = [
  ['/', '.is-style-lakehub-home-photo'],
  ['/programs/', '.is-style-lakehub-programs-photo'],
  ['/about/', '.is-style-lakehub-about-hero'],
  ['/impact/', '.is-style-lakehub-impact-hero'],
];

for (const width of [1440, 1280, 1024, 768, 390, 320]) {
  test(`photo hero typography is consistent and fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    let expectedSize;
    for (const [path, selector] of banners) {
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
        };
      });
      expectedSize ??= metrics.size;
      expect(metrics.size, path).toBeCloseTo(expectedSize, 2);
      expect(metrics.weight, path).toBe('800');
      expect(metrics.lineHeight / metrics.size, path).toBeCloseTo(1.1, 2);
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

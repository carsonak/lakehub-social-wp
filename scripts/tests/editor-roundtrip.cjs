/** Save/reload only an explicitly supplied disposable verification draft. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const id = process.env.LAKEHUB_EDITOR_POST_ID;
if (!/^\d+$/.test(id || '')) throw new Error('Set LAKEHUB_EDITOR_POST_ID to a disposable Recovery verification scratch draft.');
const base = process.env.LAKEHUB_TEST_URL || 'http://localhost:8881';
(async () => {
  const browser = await chromium.launch({ channel: process.env.LAKEHUB_BROWSER_CHANNEL || 'chromium', headless: true, args: ['--no-proxy-server', '--host-resolver-rules=MAP localhost 127.0.0.1'] });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.goto(`${base}/studio-auto-login?redirect_to=%2Fwp-admin%2F`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.goto(`${base}/wp-admin/post.php?post=${id}&action=edit`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForFunction(() => window.wp?.data?.select('core/block-editor')?.getBlocks().length > 0, null, { timeout: 60000 });
    const inspect = () => page.evaluate(() => {
      const editor = wp.data.select('core/editor');
      const blocks = wp.data.select('core/block-editor').getBlocks();
      const all = (items) => items.flatMap((block) => [block, ...all(block.innerBlocks || [])]);
      return { status: editor.getCurrentPost().status, title: editor.getEditedPostAttribute('title'), count: all(blocks).length, invalid: all(blocks).filter((block) => block.isValid === false).map((block) => block.name) };
    });
    const before = await inspect();
    assert.equal(before.status, 'draft');
    assert(before.title.startsWith('Recovery verification scratch draft'), 'Refusing to save a non-verification draft');
    assert.deepEqual(before.invalid, []);
    await page.evaluate(async () => {
      wp.data.dispatch('core/editor').editPost({ title: 'Recovery verification scratch draft saved' });
      await wp.data.dispatch('core/editor').savePost();
      if (wp.data.select('core/editor').didPostSaveRequestFail()) throw new Error('Editor save failed');
    });
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.wp?.data?.select('core/block-editor')?.getBlocks().length > 0);
    const after = await inspect();
    assert.equal(after.title, 'Recovery verification scratch draft saved');
    assert.equal(after.count, before.count);
    assert.deepEqual(after.invalid, []);
    // The iframe mounts and receives block styles after editor data is ready.
    await page.waitForFunction(() => {
      const documents = [document, ...Array.from(document.querySelectorAll('iframe')).map((frame) => frame.contentDocument).filter(Boolean)];
      return documents.some((doc) => Array.from(doc.querySelectorAll('link[rel="stylesheet"],style')).some((element) => /assets\/css\/team\.css|lakehub-team-photo\.has-design-crop/.test(element.href || element.textContent)));
    }, null, { timeout: 30000 });
    console.log(`Editor save/reload PASS: ${after.count} valid blocks, modular editor styles present.`);
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });

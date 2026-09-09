/** Local end-to-end check. Requires Playwright and an authenticated storage state.
 * LAKEHUB_TEST_URL=http://127.0.0.1:8080 LAKEHUB_TEST_STATE=.runtime/browser-state.json node scripts/tests/block-editor.cjs
 * Only temporary test records are created/deleted; existing pages are saved without edits.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require('playwright');
const base = process.env.LAKEHUB_TEST_URL || 'http://127.0.0.1:8080';
const state = process.env.LAKEHUB_TEST_STATE || '.runtime/browser-state.json';
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] });
  const context = await browser.newContext({ storageState: state, viewport: { width: 1440, height: 1000 } });
  if (base.includes('127.0.0.1')) await context.route('http://lakehub-social.com/**', route => route.continue({ url: route.request().url().replace('http://lakehub-social.com', base) }));
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  const temporary = [];
  const report = [];
  const openEditor = async id => {
    await page.goto(`${base}/wp-admin/post.php?post=${id}&action=edit`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window.wp?.data?.select('core/editor')?.getCurrentPostId());
    await page.waitForFunction(() => window.wp?.data?.select('core/block-editor')?.getBlockCount() > 0);
  };
  const request = async (path, method = 'GET', data) => page.evaluate(({path,method,data}) => wp.apiFetch({path,method,data}), {path,method,data});
  const validate = async () => page.evaluate(() => {
    const invalid = [];
    const walk = blocks => blocks.forEach(block => { if (!block.isValid) invalid.push(block.name); walk(block.innerBlocks); });
    walk(wp.data.select('core/block-editor').getBlocks()); return invalid;
  });
  try {
    for (const id of [11, 21]) {
      await openEditor(id);
      assert.deepEqual(await validate(), []);
      await page.evaluate(async () => { await wp.data.dispatch('core/editor').savePost(); });
      await openEditor(id);
      assert.deepEqual(await validate(), []);
      report.push(`Page ${id}: save/reload without invalid blocks`);
    }
    const patterns = await request('/wp/v2/block-patterns/patterns');
    const own = patterns.filter(pattern => pattern.name.startsWith('lakehub-social/'));
    assert.ok(own.length >= 11);
    const invalidPatterns = await page.evaluate(patterns => {
      return patterns.filter(pattern => {
        const walk = blocks => blocks.some(block => !block.isValid || walk(block.innerBlocks));
        return walk(wp.blocks.parse(pattern.content));
      }).map(pattern => pattern.name);
    }, own);
    assert.deepEqual(invalidPatterns, []);
    const home = await request('/wp/v2/pages/11?context=edit');
    const draft = await request('/wp/v2/pages', 'POST', {title:'LakeHub temporary editor test',status:'draft',content:home.content.raw});
    temporary.push(['/wp/v2/pages',draft.id]);
    await openEditor(draft.id);
    // Offscreen Groups mount lazily; select the figure before checking its live controls/locks.
    await page.evaluate(() => {
      const flat = []; const walk = bs => bs.forEach(b => { flat.push(b); walk(b.innerBlocks); });
      walk(wp.data.select('core/block-editor').getBlocks());
      wp.data.dispatch('core/block-editor').selectBlock(flat.find(b => b.attributes.className === 'is-style-lakehub-metric-photo').clientId);
    });
    await page.waitForFunction(() => {
      const s = wp.data.select('core/block-editor');
      return s.getTemplateLock(s.getSelectedBlockClientId()) === 'all';
    });
    const edits = await page.evaluate(() => {
      const select = wp.data.select('core/block-editor'), dispatch = wp.data.dispatch('core/block-editor');
      const blocks = select.getBlocks(); const flat = [];
      const walk = blocks => blocks.forEach(block => { flat.push(block); walk(block.innerBlocks); }); walk(blocks);
      const heading = flat.find(b => b.name === 'core/heading');
      const image = flat.find(b => b.name === 'core/image');
      const replacement = flat.filter(b => b.name === 'core/image')[1];
      const button = flat.find(b => b.name === 'core/button');
      const metric = flat.find(b => b.attributes.className === 'is-style-lakehub-metric-photo');
      const metricEditable = select.getBlockEditingMode(metric.clientId) === 'default';
      const metricLocked = !select.canRemoveBlocks([metric.innerBlocks[0].clientId]);
      dispatch.updateBlockAttributes(metric.innerBlocks[0].clientId,{content:'999+'});
      dispatch.updateBlockAttributes(metric.clientId,{style:{...metric.attributes.style,background:{backgroundImage:{url:replacement.attributes.url,id:replacement.attributes.id,source:'file'},backgroundSize:'cover'}}});
      const canMove = select.canMoveBlocks([blocks[0].clientId]);
      const canRemove = select.canRemoveBlocks([blocks.at(-1).clientId]);
      dispatch.updateBlockAttributes(heading.clientId,{content:'A client can edit this heading'});
      dispatch.updateBlockAttributes(image.clientId,{url:replacement.attributes.url,id:replacement.attributes.id,alt:'Replacement image test'});
      dispatch.updateBlockAttributes(button.clientId,{url:'/programs/',text:'Explore our programs'});
      dispatch.moveBlocksDown([blocks[0].clientId]);
      return {canMove,canRemove,metricEditable,metricLocked,replacementId:replacement.attributes.id};
    });
    assert.equal(edits.canMove,true); assert.equal(edits.canRemove,true);
    assert.equal(edits.metricEditable,true); assert.equal(edits.metricLocked,true);
    const pattern = own.find(p => p.name === 'lakehub-social/home-cta');
    await page.evaluate(content => {
      const dispatch = wp.data.dispatch('core/block-editor');
      dispatch.insertBlocks(wp.blocks.parse(content));
    }, pattern.content);
    await page.evaluate(async()=>{await wp.data.dispatch('core/editor').savePost();});
    await openEditor(draft.id);
    assert.deepEqual(await validate(),[]);
    const saved = await request(`/wp/v2/pages/${draft.id}?context=edit`);
    assert.ok(saved.content.raw.includes('A client can edit this heading'));
    assert.ok(saved.content.raw.includes('Replacement image test'));
    assert.ok(saved.content.raw.includes('Explore our programs'));
    assert.ok(saved.content.raw.includes('999+'));
    const savedMetric = await page.evaluate(()=>{const flat=[];const walk=bs=>bs.forEach(b=>{flat.push(b);walk(b.innerBlocks);});walk(wp.data.select('core/block-editor').getBlocks());return flat.find(b=>b.attributes.className==='is-style-lakehub-metric-photo').attributes.style.background.backgroundImage;});
    assert.equal(savedMetric.id,edits.replacementId);
    report.push('Impact figure: native background controls available, internal structure locked, value and photo changes survive reload');
    assert.equal(await page.evaluate(()=>wp.data.select('core/block-editor').getBlockCount()),7);
    assert.equal(await page.evaluate(()=>wp.data.select('core/block-editor').getBlocks()[1].attributes.metadata.name),'Home · Hero');
    report.push('Draft: edited heading, replaced image, changed button link, moved section, inserted pattern, saved and reloaded');
    // Remove an added section through the editor and verify the saved count.
    await page.evaluate(async()=>{const s=wp.data.select('core/block-editor');await wp.data.dispatch('core/block-editor').removeBlocks([s.getBlocks().at(-1).clientId]);await wp.data.dispatch('core/editor').savePost();});
    await openEditor(draft.id);
    assert.equal(await page.evaluate(()=>wp.data.select('core/block-editor').getBlockCount()),6);
    report.push('Draft: section deletion persisted');
    const sourceProgram = await request('/wp/v2/program/22?context=edit');
    const program = await request('/wp/v2/program','POST',{title:'LakeHub temporary program test',status:'draft',content:'<!-- wp:paragraph --><p>Editable program description.</p><!-- /wp:paragraph -->',featured_media:sourceProgram.featured_media,menu_order:99,meta:{_lakehub_program_url:'/programs/'}});
    temporary.push(['/wp/v2/program',program.id]);
    await openEditor(program.id);
    assert.deepEqual(await validate(),[]);
    await page.locator('#lakehub-program-url').fill(`${base}/programs/`);
    await page.locator('#lakehub-program-order').fill('98');
    await page.evaluate(async()=>{wp.data.dispatch('core/editor').editPost({excerpt:'Unused legacy excerpt'});await wp.data.dispatch('core/editor').savePost();});
    await openEditor(program.id);
    assert.equal(await page.locator('#lakehub-program-order').inputValue(),'98');
    assert.equal(await page.locator('#lakehub-program-url').inputValue(),`${base}/programs/`);
    report.push('Program: description, featured image, destination, and display order saved and reloaded');
    // An unpublished program must not appear in the public collection.
    const publicPage = await context.newPage();
    await publicPage.goto(`${base}/programs/`,{waitUntil:'domcontentloaded'});
    assert.equal(await publicPage.locator('.lakehub-program').count(),4);
    assert.equal(await publicPage.getByText('LakeHub temporary program test').count(),0);
    await publicPage.setViewportSize({width:390,height:844});
    const menu = publicPage.getByRole('button',{name:'Open menu',exact:true});
    await menu.click();
    await publicPage.getByRole('button',{name:'Close menu',exact:true}).waitFor({state:'visible'});
    await publicPage.keyboard.press('Escape');
    await publicPage.getByRole('button',{name:'Close menu',exact:true}).waitFor({state:'hidden'});
    await publicPage.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await publicPage.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
    report.push('Frontend: draft excluded, native mobile menu opens/closes by keyboard, reduced motion enabled');
    await publicPage.close();
    fs.writeFileSync('.runtime/editor-test-report.json',JSON.stringify(report,null,2));
    console.log(report.join('\n'));
  } finally {
    for (const [path,id] of temporary.reverse()) await request(`${path}/${id}?force=true`,'DELETE').catch(error=>console.error(`Cleanup ${id}: ${error.message}`));
    await browser.close();
  }
})().catch(error=>{console.error(error);process.exitCode=1;});

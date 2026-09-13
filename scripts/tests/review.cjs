/** Review regressions against the canonical local Studio site. No records are changed. */
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const base = process.env.LAKEHUB_TEST_URL || 'http://localhost:8881';
const task = process.env.REVIEW_TASK || 'all';
(async () => {
 const browser = await chromium.launch({headless: true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}), args:['--no-sandbox']});
 const context = await browser.newContext({viewport:{width:1280,height:900}});
 const page = await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const open=async(path='/')=>{await page.goto(base+path,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);};
 const scroll=async y=>{await page.evaluate(y=>window.scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(650);};
 try {
  if(task==='all'||task==='01') {
   await open(); const header=page.locator('.wp-site-blocks > header');
   const heroTop=await page.locator('main').evaluate(e=>e.getBoundingClientRect().top+scrollY);
   await scroll(500);assert.ok(await header.evaluate(e=>e.classList.contains('is-navbar-hidden')));
   await scroll(490);assert.ok(await header.evaluate(e=>!e.classList.contains('is-navbar-hidden')));
   assert.equal(await page.locator('main').evaluate(e=>e.getBoundingClientRect().top+scrollY),heroTop,'Sticky header reserves its footprint');
   await scroll(600);await header.locator('a').first().focus();assert.ok(await header.evaluate(e=>!e.classList.contains('is-navbar-hidden')));
   await scroll(750);assert.ok(await header.evaluate(e=>!e.classList.contains('is-navbar-hidden')),'Focused navigation stays visible');
   await page.evaluate(()=>document.activeElement.blur());await scroll(0);
   await page.setViewportSize({width:390,height:700});
   await page.locator('.wp-block-navigation__responsive-container-open').click();
   await scroll(500);assert.ok(await header.evaluate(e=>!e.classList.contains('is-navbar-hidden')),'Open menu stays visible');
   await page.keyboard.press('Escape');assert.equal(await page.locator('.is-menu-open').count(),0);
   await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await header.evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
   await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1280,height:900});
   console.log('PASS 01: navbar directions, footprint, focus, mobile menu, reduced motion');
  }
  if(task==='all'||task==='02') {
   for (const width of [320,390,768,1024,1280,1440]) {
    await page.setViewportSize({width,height:900});await open();
    await page.locator('footer').scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Footer does not overflow at '+width);
    if(width>900) {
     const tops=await page.locator('.is-style-lakehub-footer-links').evaluateAll(es=>es.map(e=>[e.firstElementChild.getBoundingClientRect().top,e.children[1].getBoundingClientRect().top]));
     assert.ok(Math.max(...tops.map(x=>x[0]))-Math.min(...tops.map(x=>x[0]))<1,'Heading boxes align');
     assert.ok(Math.max(...tops.map(x=>x[1]))-Math.min(...tops.map(x=>x[1]))<1,'First content rows align');
    }
    await page.locator('footer').screenshot({path:`.runtime/review-20260913/footer-${width}.png`});
   }
   await page.setViewportSize({width:1280,height:900});
   console.log('PASS 02: footer row alignment and responsive overflow');
  }
  if(task==='all'||task==='03') {
   await open('/impact/');
   const section = page.locator('#community-engagements');
   assert.equal(await section.count(), 1, 'Anchor #community-engagements preserved');
   const heading = section.locator('h2');
   assert.equal(await heading.innerText(), 'Community Projects');
   console.log('PASS 03: rename Community Engagements to Community Projects with preserved anchor');
  }
  if(task==='all'||task==='04') {
   await open('/programs/');
   const cards = page.locator('.lakehub-program');
   const count = await cards.count();
   assert.ok(count >= 2, 'Program cards found');
   const lastCard = cards.last();
   assert.ok(await lastCard.evaluate(e => e.classList.contains('is-card-below')), 'Lower cards start in is-card-below state');
   await lastCard.scrollIntoViewIfNeeded();
   await page.waitForTimeout(650);
   assert.ok(await lastCard.evaluate(e => e.classList.contains('is-card-visible')), 'Card becomes is-card-visible when scrolled into view');
   await scroll(await page.evaluate(() => document.body.scrollHeight));
   const firstCard = cards.first();
   assert.ok(await firstCard.evaluate(e => e.classList.contains('is-card-above')), 'Upper card transitions to is-card-above when scrolled past');
   await firstCard.scrollIntoViewIfNeeded();
   await page.waitForTimeout(650);
   assert.ok(await firstCard.evaluate(e => e.classList.contains('is-card-visible')), 'Upper card returns to is-card-visible on upward scroll');
   await lastCard.evaluate(e => { e.tabIndex = 0; e.focus(); });
   assert.ok(await lastCard.evaluate(e => e.classList.contains('is-card-visible')), 'Focused card remains visible');
   await page.emulateMedia({reducedMotion:'reduce'});
   assert.ok(await firstCard.evaluate(e => getComputedStyle(e).transitionDuration === '0s'), 'Transitions disabled with reduced motion');
   await page.emulateMedia({reducedMotion:'no-preference'});
   console.log('PASS 04: program cards two-edge scroll states, focus pinning, and reduced motion');
  }
  if(task==='all'||task==='05') {
   await open('/');
   const rows = page.locator('.is-style-lakehub-metric-row');
   const count = await rows.count();
   assert.ok(count >= 4, 'Metric rows found on home page');
   const lastRow = rows.last();
   const lastCopy = lastRow.locator('.is-style-lakehub-metric-copy');
   assert.ok(await lastCopy.evaluate(e => e.classList.contains('is-reveal-ready') && !e.classList.contains('is-revealed')), 'Lower metric copy starts unrevealed');
   await lastRow.scrollIntoViewIfNeeded();
   await page.waitForTimeout(650);
   assert.ok(await lastCopy.evaluate(e => e.classList.contains('is-revealed')), 'Metric copy becomes is-revealed when scrolled 50% into view');
   await scroll(0);
   assert.ok(await lastCopy.evaluate(e => e.classList.contains('is-revealed')), 'Revealed metric copy stays revealed after scrolling away');
   const photo = rows.first().locator('.is-style-lakehub-metric-photo');
   await photo.hover();
   await page.waitForTimeout(250);
   const transform = await photo.evaluate(e => getComputedStyle(e).transform);
   assert.ok(transform.includes('matrix') && transform !== 'none', 'Hover scales metric photo');
   await page.setViewportSize({width:390,height:800});
   await open('/');
   const mobileRows = page.locator('.is-style-lakehub-metric-row');
   const mobileLastCopy = mobileRows.last().locator('.is-style-lakehub-metric-copy');
   assert.ok(await mobileLastCopy.evaluate(e => e.classList.contains('is-reveal-ready')), 'Mobile metric copy ready');
   await mobileRows.last().scrollIntoViewIfNeeded();
   await page.waitForTimeout(650);
   assert.ok(await mobileLastCopy.evaluate(e => e.classList.contains('is-revealed')), 'Mobile metric copy revealed');
   await page.setViewportSize({width:1280,height:900});
   console.log('PASS 05: metric description one-time reveals, photo hover scaling, and responsive emergence');
  }
  if(task==='all'||task==='06') {
   await open('/about/');
   const storyPhoto = page.locator('.is-style-lakehub-story-photo');
   await storyPhoto.scrollIntoViewIfNeeded();
   const box = await storyPhoto.boundingBox();
   assert.ok(box, 'Story photo found');

   await page.mouse.move(box.x + 20, box.y + 20);
   await page.waitForTimeout(200);
   const repelX1 = await storyPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-x')));
   const repelY1 = await storyPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-y')));
   assert.ok(repelX1 > 0, 'Pointer at left pushes frame right');
   assert.ok(repelY1 > 0, 'Pointer at top pushes frame down');
   assert.ok(Math.hypot(repelX1, repelY1) <= 36.1, 'Total displacement capped within dot spacing');

   await page.mouse.move(box.x + box.width - 20, box.y + box.height - 20);
   await page.waitForTimeout(200);
   const repelX2 = await storyPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-x')));
   const repelY2 = await storyPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-y')));
   assert.ok(repelX2 < 0, 'Pointer at right pushes frame left');
   assert.ok(repelY2 < 0, 'Pointer at bottom pushes frame up');
   assert.ok(Math.hypot(repelX2, repelY2) <= 36.1, 'Total displacement capped within dot spacing');

   await page.mouse.move(0, 0);
   await page.waitForTimeout(200);
   const resetX = await storyPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-x')) || 0);
   const resetY = await storyPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-y')) || 0);
   assert.equal(resetX, 0, 'Repel X resets to 0 on leave');
   assert.equal(resetY, 0, 'Repel Y resets to 0 on leave');

   await open('/impact/');
   const communityPhoto = page.locator('.is-style-lakehub-community-photo');
   await communityPhoto.scrollIntoViewIfNeeded();
   const cBox = await communityPhoto.boundingBox();
   assert.ok(cBox, 'Community photo found');
   await page.mouse.move(cBox.x + 20, cBox.y + cBox.height / 2);
   await page.waitForTimeout(200);
   const cRepelX = await communityPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-x')));
   assert.ok(cRepelX > 0, 'Community photo repels right away from left pointer');
   await page.mouse.move(0, 0);

   await page.emulateMedia({reducedMotion:'reduce'});
   await page.mouse.move(cBox.x + 20, cBox.y + cBox.height / 2);
   await page.waitForTimeout(200);
   const rmTransform = await communityPhoto.evaluate(e => getComputedStyle(e).transform);
   assert.equal(rmTransform, 'none', 'No transform with reduced motion');
   await page.emulateMedia({reducedMotion:'no-preference'});

   console.log('PASS 06: halftone image repulsion in all directions, cap, reset, and reduced motion');
  }
  if(task==='all'||task==='07') {
   await open('/about/');
   const storyPhoto = page.locator('.is-style-lakehub-story-photo');
   const desktopSpacing = await storyPhoto.evaluate(e => getComputedStyle(e).getPropertyValue('--lakehub-dot-spacing').trim());
   assert.equal(desktopSpacing, '36px', 'Desktop halftone spacing is 36px');

   const storyBg = await storyPhoto.evaluate(e => getComputedStyle(e, '::before').backgroundImage);
   assert.ok(storyBg.includes('halftone-tile.svg'), 'Story photo uses derived halftone tile');

   const storyBeforeTop = await storyPhoto.evaluate(e => parseFloat(getComputedStyle(e, '::before').top));
   const storyBeforeLeft = await storyPhoto.evaluate(e => parseFloat(getComputedStyle(e, '::before').left));
   assert.equal(storyBeforeTop, -36, 'Story dots top offset is -36px (1 row)');
   assert.equal(storyBeforeLeft, -72, 'Story dots left offset is -72px (2 columns)');

   await open('/impact/');
   const communityGrid = page.locator('.is-style-lakehub-community-grid');
   const commBeforeTop = await communityGrid.evaluate(e => parseFloat(getComputedStyle(e, '::before').top));
   const commBeforeLeft = await communityGrid.evaluate(e => parseFloat(getComputedStyle(e, '::before').left));
   assert.equal(commBeforeTop, -36, 'Community dots top offset is -36px (1 row)');
   assert.equal(commBeforeLeft, -72, 'Community dots left offset is -72px (2 columns)');

   await page.setViewportSize({width:390,height:800});
   await open('/about/');
   const mobileStoryPhoto = page.locator('.is-style-lakehub-story-photo');
   const mobileSpacing = await mobileStoryPhoto.evaluate(e => getComputedStyle(e).getPropertyValue('--lakehub-dot-spacing').trim());
   assert.equal(mobileSpacing, '16px', 'Mobile halftone spacing is 16px');

   const mobileBeforeTop = await mobileStoryPhoto.evaluate(e => parseFloat(getComputedStyle(e, '::before').top));
   const mobileBeforeLeft = await mobileStoryPhoto.evaluate(e => parseFloat(getComputedStyle(e, '::before').left));
   assert.equal(mobileBeforeTop, -16, 'Mobile story dots top offset is -16px (1 row)');
   assert.equal(mobileBeforeLeft, -32, 'Mobile story dots left offset is -32px (2 columns)');

   await mobileStoryPhoto.scrollIntoViewIfNeeded();
   const mBox = await mobileStoryPhoto.boundingBox();
   await page.mouse.move(mBox.x + 10, mBox.y + 10);
   await page.waitForTimeout(200);
   const mRepelX = await mobileStoryPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-x')));
   const mRepelY = await mobileStoryPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-y')));
   const mDisp = Math.hypot(mRepelX, mRepelY);
   assert.ok(mDisp <= 16.1, 'Mobile hover repulsion displacement capped at 16px');
   await page.mouse.move(0, 0);

   await page.setViewportSize({width:1280,height:900});
   console.log('PASS 07: halftone tile density, at-rest anchoring, and mobile spacing adaptation');
  }
  if(task==='all'||task==='08') {
   await open('/impact/');
   const grid = page.locator('.is-style-lakehub-transformation-grid');
   assert.equal(await grid.count(), 1, 'Transformation grid found on impact page');
   const cards = grid.locator('.is-style-lakehub-transformation-card');
   assert.equal(await cards.count(), 4, '4 transformation cards found');

   await grid.scrollIntoViewIfNeeded();
   await page.waitForTimeout(200);

   // Desktop layout check
   const cardBoxes = await cards.evaluateAll(es => es.map(e => {
    const r = e.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height, borderRadius: getComputedStyle(e).borderRadius };
   }));
   assert.ok(cardBoxes[0].borderRadius.includes('50%'), 'Cards have circular border-radius 50%');
   assert.ok(cardBoxes[1].left > cardBoxes[0].left, 'Desktop cards laid out horizontally');
   assert.ok(cardBoxes[1].left < cardBoxes[0].left + cardBoxes[0].width, 'Desktop cards overlap horizontally');

   // Pointer proximity test: hover over first card
   const firstCardCenter = { x: cardBoxes[0].left + cardBoxes[0].width / 2, y: cardBoxes[0].top + cardBoxes[0].height / 2 };
   await page.mouse.move(firstCardCenter.x, firstCardCenter.y);
   await page.waitForTimeout(250);

   const c0Scale = await cards.nth(0).evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-circle-scale')));
   const c0Opacity = await cards.nth(0).evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-circle-opacity')));
   const c0Z = await cards.nth(0).evaluate(e => parseInt(e.style.getPropertyValue('--lakehub-circle-z')));
   const c3Opacity = await cards.nth(3).evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-circle-opacity')));

   assert.ok(c0Scale >= 1.04, 'Active card scales up to ~1.05');
   assert.ok(c0Opacity >= 0.98, 'Active card has full opacity ~1.0');
   assert.equal(c0Z, 10, 'Active card has peak z-index 10');
   assert.ok(c3Opacity <= 0.88, 'Distant sibling opacity blends towards 0.85');

   // Crossover test between card 0 and card 1
   const secondCardCenter = { x: cardBoxes[1].left + cardBoxes[1].width / 2, y: cardBoxes[1].top + cardBoxes[1].height / 2 };
   const midX = (firstCardCenter.x + secondCardCenter.x) / 2;
   const midY = (firstCardCenter.y + secondCardCenter.y) / 2;

   // Slightly left of crossover
   await page.mouse.move(midX - 15, midY);
   await page.waitForTimeout(150);
   const zBefore = [
    await cards.nth(0).evaluate(e => parseInt(e.style.getPropertyValue('--lakehub-circle-z'))),
    await cards.nth(1).evaluate(e => parseInt(e.style.getPropertyValue('--lakehub-circle-z')))
   ];
   assert.ok(zBefore[0] > zBefore[1], 'Card 0 draws on top when pointer is left of crossover');

   // Slightly right of crossover
   await page.mouse.move(midX + 15, midY);
   await page.waitForTimeout(150);
   const zAfter = [
    await cards.nth(0).evaluate(e => parseInt(e.style.getPropertyValue('--lakehub-circle-z'))),
    await cards.nth(1).evaluate(e => parseInt(e.style.getPropertyValue('--lakehub-circle-z')))
   ];
   assert.ok(zAfter[1] > zAfter[0], 'Card 1 draws on top when pointer is right of crossover');

   // Reset on pointer leave
   await page.mouse.move(0, 0);
   await page.waitForTimeout(250);
   const resetScale = await cards.nth(0).evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-circle-scale')));
   const resetOpacity = await cards.nth(0).evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-circle-opacity')));
   assert.equal(resetScale, 1, 'Scale resets to baseline 1');
   assert.equal(resetOpacity, 1, 'Opacity resets to baseline 1');

   // Mobile layout and scroll proximity
   await page.setViewportSize({width: 390, height: 800});
   await open('/impact/');
   const mobileCards = page.locator('.is-style-lakehub-transformation-card');
   const mBoxes = await mobileCards.evaluateAll(es => es.map(e => {
    const r = e.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height, borderRadius: getComputedStyle(e).borderRadius };
   }));

   assert.ok(mBoxes[0].borderRadius.includes('50%'), 'Mobile cards remain circular with border-radius 50%');
   assert.ok(mBoxes[0].width <= 353, 'Mobile circle diameter is capped at max 22rem');
   assert.ok(Math.abs(mBoxes[0].left - mBoxes[1].left) < 5, 'Mobile cards are aligned in a single centered column');
   assert.ok(mBoxes[1].top < mBoxes[0].top + mBoxes[0].height, 'Mobile cards vertically overlap (~12%)');

   // Scroll proximity on mobile
   await mobileCards.nth(1).scrollIntoViewIfNeeded();
   await page.waitForTimeout(300);
   const m1Z = await mobileCards.nth(1).evaluate(e => parseInt(e.style.getPropertyValue('--lakehub-circle-z')));
   const m1Scale = await mobileCards.nth(1).evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-circle-scale')));
   assert.ok(m1Z >= 9, 'Centered mobile card gets peak z-index');
   assert.ok(m1Scale > 1.01, 'Centered mobile card scales up via scroll proximity');

   // Reduced motion check
   await page.emulateMedia({reducedMotion: 'reduce'});
   const rmTransform = await mobileCards.nth(1).evaluate(e => getComputedStyle(e).transform);
   assert.equal(rmTransform, 'none', 'Mobile transform disabled with reduced motion');
   await page.emulateMedia({reducedMotion: 'no-preference'});

   await page.setViewportSize({width: 1280, height: 900});
   console.log('PASS 08: transformation circles desktop horizontal overlap, pointer proximity, crossover z-index, mobile vertical overlap, scroll proximity, and reduced motion');
  }
  assert.deepEqual(errors,[]);
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

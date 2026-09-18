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
   const revealXs = await cards.evaluateAll(es => es.map(e => getComputedStyle(e).getPropertyValue('--lakehub-reveal-x').trim()));
   assert.ok(revealXs.every(x => x === '2.5rem' || parseFloat(x) > 0), 'All cards use uniform positive reveal-x');
   await lastCard.scrollIntoViewIfNeeded();
   await page.waitForTimeout(650);
   assert.ok(await lastCard.evaluate(e => e.classList.contains('is-card-visible')), 'Card becomes is-card-visible when scrolled into view');
   await scroll(await page.evaluate(() => document.body.scrollHeight));
   const firstCard = cards.first();
   assert.ok(await firstCard.evaluate(e => e.classList.contains('is-card-above')), 'Upper card transitions to is-card-above when scrolled past');
   await firstCard.scrollIntoViewIfNeeded();
   await page.waitForTimeout(650);
   assert.ok(await firstCard.evaluate(e => e.classList.contains('is-card-visible')), 'Upper card returns to is-card-visible on upward scroll');
    // Explicitly test 1/3 (33.3%) threshold
    const secondCard = cards.nth(1);
    const cardInfo = await secondCard.evaluate((el) => {
      let top = 0;
      let e = el;
      while (e) { top += e.offsetTop || 0; e = e.offsetParent; }
      const adminBottom = Math.max(0, document.getElementById('wpadminbar')?.getBoundingClientRect().bottom || 0);
      const headerClearance = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lakehub-header-clearance')) || (adminBottom + 80);
      return { top, height: el.offsetHeight, viewHeight: Math.max(200, window.innerHeight - headerClearance), headerClearance };
    });
    // Scroll so that only 25% is in view (< 33.3%)
    await scroll(cardInfo.top - cardInfo.headerClearance - cardInfo.viewHeight + (cardInfo.height * 0.25));
    await page.waitForTimeout(250);
    assert.ok(await secondCard.evaluate(e => e.classList.contains('is-card-below')), 'Card remains is-card-below when < 1/3 in view');

    // Scroll so that 40% is in view (>= 33.3%)
    await scroll(cardInfo.top - cardInfo.headerClearance - cardInfo.viewHeight + (cardInfo.height * 0.40));
    await page.waitForTimeout(250);
    assert.ok(await secondCard.evaluate(e => e.classList.contains('is-card-visible')), 'Card becomes is-card-visible when >= 1/3 in view');

    await lastCard.evaluate(e => { e.tabIndex = 0; e.focus(); });
    assert.ok(await lastCard.evaluate(e => e.classList.contains('is-card-visible')), 'Focused card remains visible');
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.ok(await firstCard.evaluate(e => getComputedStyle(e).transitionDuration === '0s'), 'Transitions disabled with reduced motion');
    await page.emulateMedia({reducedMotion:'no-preference'});
    console.log('PASS 04: program cards two-edge scroll states, 1/3 threshold, uniform trajectory, focus pinning, and reduced motion');
  }
  if(task==='all'||task==='05') {
    await open('/');
    const rows = page.locator('.is-style-lakehub-metric-row');
    const count = await rows.count();
    assert.ok(count >= 4, 'Metric rows found on home page');
    const lastRow = rows.last();
    const lastCopy = lastRow.locator('.is-style-lakehub-metric-copy');
    assert.ok(await lastCopy.evaluate(e => e.classList.contains('is-reveal-ready') && !e.classList.contains('is-revealed')), 'Lower metric copy starts unrevealed');

    // Test row 1 exit when scrolled past header
    await scroll(1100);
    assert.ok(await rows.first().evaluate(e => !e.classList.contains('is-revealed')), 'Row 1 exits when scrolled past header clearance');
    await scroll(500);
    assert.ok(await rows.first().evaluate(e => e.classList.contains('is-revealed')), 'Row 1 re-enters when scrolled back into view');

    const secondRow = rows.nth(1);
    await scroll(0);
   const unrevealedLineWidth = await secondRow.evaluate(e => parseFloat(getComputedStyle(e, '::after').width));
   const totalRowWidth = await secondRow.evaluate(e => parseFloat(getComputedStyle(e).width));
   assert.ok(unrevealedLineWidth / totalRowWidth < 0.5, 'Separating line is shrunk when unrevealed');

    await secondRow.scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    const revealedLineWidth = await secondRow.evaluate(e => parseFloat(getComputedStyle(e, '::after').width));
    assert.ok(Math.abs(revealedLineWidth - totalRowWidth) < 2, 'Separating line expands to full width when revealed');

    await lastRow.scrollIntoViewIfNeeded();
    await page.waitForTimeout(650);
    assert.ok(await lastCopy.evaluate(e => e.classList.contains('is-revealed')), 'Metric copy becomes is-revealed when scrolled into view');

   await scroll(0);
   assert.ok(await lastRow.evaluate(e => !e.classList.contains('is-revealed')), 'Metric row swallows back on scroll away');

   const photo = rows.first().locator('.is-style-lakehub-metric-photo');
   const p = photo.locator('p');
   const baseFontSize = await p.evaluate(e => parseFloat(getComputedStyle(e).fontSize));
   const baseTransform = await photo.evaluate(e => getComputedStyle(e).transform);
   await photo.hover();
   await page.waitForTimeout(300);
   const hoverFontSize = await p.evaluate(e => parseFloat(getComputedStyle(e).fontSize));
   const hoverTransform = await photo.evaluate(e => getComputedStyle(e).transform);
   assert.ok(hoverFontSize > baseFontSize, 'Hover expands masking text font-size');
   assert.equal(hoverTransform, baseTransform, 'Photo container transform does not zoom underlying image');

   await page.setViewportSize({width:390,height:800});
   await open('/');
   const mobileRows = page.locator('.is-style-lakehub-metric-row');
   const mobileLastCopy = mobileRows.last().locator('.is-style-lakehub-metric-copy');
   assert.ok(await mobileLastCopy.evaluate(e => e.classList.contains('is-reveal-ready')), 'Mobile metric copy ready');
   await mobileRows.last().scrollIntoViewIfNeeded();
   await page.waitForTimeout(650);
   assert.ok(await mobileLastCopy.evaluate(e => e.classList.contains('is-revealed')), 'Mobile metric copy revealed');
   await page.setViewportSize({width:1280,height:900});
   console.log('PASS 05: metric bidirectional center reveal/swallow, line expansion, and text-only hover zoom');
  }
  if(task==='all'||task==='06') {
   await open('/about/');
   await page.mouse.move(0, 0);
   const storyPhoto = page.locator('.is-style-lakehub-story-photo');
   await storyPhoto.scrollIntoViewIfNeeded();
   await page.waitForTimeout(250);
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
    const hasDynamicStory = await storyPhoto.evaluate(e => !!e.querySelector('.lakehub-halftone-layer'));
    if (hasDynamicStory) {
      assert.ok(hasDynamicStory, 'Story photo uses dynamic halftone layer');
    } else {
      const storyBg = await storyPhoto.evaluate(e => getComputedStyle(e, '::before').backgroundImage);
      assert.ok(storyBg.includes('dots'), 'Story photo uses halftone dots');
      const storyBeforeBottom = await storyPhoto.evaluate(e => parseFloat(getComputedStyle(e, '::before').bottom));
      const storyBeforeLeft = await storyPhoto.evaluate(e => parseFloat(getComputedStyle(e, '::before').left));
      assert.ok(Math.abs(storyBeforeBottom - (-37)) < 1.5, 'Story dots bottom offset is -37px from Figma');
      assert.ok(Math.abs(storyBeforeLeft - (-41)) < 1.5, 'Story dots left offset is -41px from Figma');
    }

    await open('/impact/');
    const commPhoto = page.locator('.is-style-lakehub-community-photo');
    const hasDynamicComm = await commPhoto.evaluate(e => !!e.querySelector('.lakehub-halftone-layer'));
    if (hasDynamicComm) {
      assert.ok(hasDynamicComm, 'Community photo uses dynamic halftone layer');
    } else {
      const commBg = await commPhoto.evaluate(e => getComputedStyle(e, '::before').backgroundImage);
      assert.ok(commBg.includes('dots'), 'Community photo uses halftone dots');
    }

    const portPhoto = page.locator('.is-style-lakehub-portfolio-photo');
    const hasDynamicPort = await portPhoto.evaluate(e => !!e.querySelector('.lakehub-halftone-layer'));
    if (hasDynamicPort) {
      assert.ok(hasDynamicPort, 'Portfolio photo uses dynamic halftone layer');
    } else {
      const portBg = await portPhoto.evaluate(e => getComputedStyle(e, '::before').backgroundImage);
      assert.ok(portBg.includes('dots'), 'Portfolio photo uses halftone dots');
    }

    // Verify SVG dot edge fade-out and zero boundary clipping
    const fs = require('node:fs');
    for (const file of ['community-dots.svg', 'portfolio-dots.svg', 'story-dots.svg']) {
      const svg = fs.readFileSync(`wp-content/themes/lakehub-social/assets/images/completion/${file}`, 'utf8');
      const vb = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
      assert.ok(vb, `${file} has valid viewBox`);
      const w = parseFloat(vb[1]), h = parseFloat(vb[2]);
      const circles = [...svg.matchAll(/<circle cx="([\d\.]+)" cy="([\d\.]+)" r="([\d\.]+)"/g)];
      assert.ok(circles.length > 50, `${file} contains halftone circles`);
      let minR = 99, maxR = 0;
      for (const m of circles) {
        const cx = parseFloat(m[1]), cy = parseFloat(m[2]), r = parseFloat(m[3]);
        assert.ok(cx - r >= 2 && cx + r <= w - 2, `${file} dot at (${cx},${cy}) strictly inside width with zero clipping`);
        assert.ok(cy - r >= 2 && cy + r <= h - 2, `${file} dot at (${cx},${cy}) strictly inside height with zero clipping`);
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
      }
      assert.ok(minR < maxR * 0.4, `${file} dot radii fade out smoothly towards perimeter (min=${minR}, max=${maxR})`);
    }

    await page.setViewportSize({width:390,height:800});
    await open('/about/');
    const mobileStoryPhoto = page.locator('.is-style-lakehub-story-photo');
    await mobileStoryPhoto.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const mBox = await mobileStoryPhoto.boundingBox();
    await page.mouse.move(mBox.x + 10, mBox.y + 10);
    await page.waitForTimeout(250);
    const mRepelX = await mobileStoryPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-x')));
    const mRepelY = await mobileStoryPhoto.evaluate(e => parseFloat(e.style.getPropertyValue('--lakehub-repel-y')));
    const mDisp = Math.hypot(mRepelX, mRepelY);
    assert.ok(mDisp <= 14.1, 'Mobile hover repulsion displacement active');
    await page.mouse.move(0, 0);

    await page.setViewportSize({width:1280,height:900});
    console.log('PASS 07: halftone fade-out patterns, locked Figma offsets, and zero boundary clipping');
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
  if(task==='all'||task==='09') {
   await open('/about/');
   const card = page.locator('.is-style-lakehub-mission-card');
   assert.equal(await card.count(), 1, 'Mission & Vision card found');
   const copyCol = page.locator('.is-style-lakehub-mission-copy');
   const collage = page.locator('.is-style-lakehub-mission-collage');
   const collageRect = await collage.boundingBox();
   const dividingLine = collageRect.x;

   const group = page.locator('.is-style-lakehub-mission-group');
   const speaker = page.locator('.is-style-lakehub-mission-speaker');
   const event = page.locator('.is-style-lakehub-mission-event');
   const main = page.locator('.is-style-lakehub-mission-main');

    const cardRect = await card.boundingBox();
    const mBox = await main.boundingBox();
    const mCenterX = mBox.x + mBox.width / 2;
    const distFromRight = (cardRect.x + cardRect.width) - mCenterX;
    assert.ok(Math.abs(distFromRight - 26.5) < 1.5, `Main diamond center anchored 26.5px inside right border (was ${distFromRight.toFixed(2)}px)`);

    const copyBg = await copyCol.evaluate(e => getComputedStyle(e).backgroundColor);
    const copyZ = await copyCol.evaluate(e => parseInt(getComputedStyle(e).zIndex));
    assert.ok(copyZ >= 2, 'Copy column has elevated z-index to hide outer left corners');
    assert.ok(copyBg.includes('rgb(255, 255, 255)'), 'Copy column has opaque background');

    const sBox = await speaker.boundingBox();
    const eBox = await event.boundingBox();
    const groupBox = await group.boundingBox();

    const gCenter = { x: groupBox.x + groupBox.width / 2, y: groupBox.y + groupBox.height / 2 };
    const sCenter = { x: sBox.x + sBox.width / 2, y: sBox.y + sBox.height / 2 };
    const eCenter = { x: eBox.x + eBox.width / 2, y: eBox.y + eBox.height / 2 };
    const mCenter = { x: mBox.x + mBox.width / 2, y: mBox.y + mBox.height / 2 };

    const gapGS = (Math.abs(sCenter.x - gCenter.x) + Math.abs(sCenter.y - gCenter.y)) / Math.SQRT2 - 150;
    const gapGE = (Math.abs(eCenter.x - gCenter.x) + Math.abs(eCenter.y - gCenter.y)) / Math.SQRT2 - 150;
    const gapSM = (Math.abs(mCenter.x - sCenter.x) + Math.abs(mCenter.y - sCenter.y)) / Math.SQRT2 - (401 + 150) / 2;
    const gapEM = (Math.abs(mCenter.x - eCenter.x) + Math.abs(mCenter.y - eCenter.y)) / Math.SQRT2 - (401 + 150) / 2;

    assert.ok(Math.abs(gapGS - gapGE) < 1, 'Gaps GS and GE are equal');
    assert.ok(Math.abs(gapGS - gapSM) < 1, 'Gaps GS and SM are equal');
    assert.ok(Math.abs(gapGS - gapEM) < 1, 'Gaps GS and EM are equal');

    // Viewport stability: verify right-border anchoring on desktop (1440px) and tablet (820px)
    for (const vp of [{width: 1440, height: 900}, {width: 820, height: 1024}]) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(150);
      const cBox = await card.boundingBox();
      const mb = await main.boundingBox();
      const offset = (cBox.x + cBox.width) - (mb.x + mb.width / 2);
      const scale = vp.width >= 1280 ? vp.width / 1280 : 1;
      const expectedOffset = 26.5 * scale;
      assert.ok(Math.abs(offset - expectedOffset) < 1.5, `Main diamond center stays anchored at proportional ${expectedOffset.toFixed(2)}px inside right border at ${vp.width}px (was ${offset.toFixed(2)}px)`);
    }
    await page.setViewportSize({width: 1280, height: 900});

    console.log('PASS 09: mission & vision cross grid alignment, equal diagonal gaps, and right-border center anchoring across viewports');
  }
  if(task==='all'||task==='10') {
   await open('/about/');
   const introText = await page.locator('.is-style-lakehub-about-intro p').innerText();
   assert.ok(introText.includes('LakeHub is a tech education and innovation ecosystem that creates pathways'), 'Intro text matches Figma');

   const headings = await page.locator('.is-style-lakehub-mission-copy h3').allInnerTexts();
   assert.deepEqual(headings, ['What we dream of doing?', 'Where we’re heading?'], 'Mission headings match Figma');

   const missionParas = await page.locator('.is-style-lakehub-mission-copy p').allInnerTexts();
   assert.ok(missionParas[0].includes('To democratize access to quality technical training'), 'Mission text 1 matches');
   assert.ok(missionParas[1].includes('To cultivate a fully integrated regional network'), 'Mission text 2 matches');

   console.log('PASS 10: about page intro narrative and mission & vision Figma copy updates');
  }
   if(task==='all'||task==='11') {
    await open('/');
    for (const width of [1280, 1440, 1920]) {
      await page.setViewportSize({width, height: 900});
      const rootFontSize = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
      const expected = width * 0.0125;
      assert.ok(Math.abs(rootFontSize - expected) < 0.2, `Root font-size must be ${expected}px at ${width}px viewport (was ${rootFontSize}px)`);
    }
    await page.setViewportSize({width: 1280, height: 900});
    console.log('PASS 11: dynamic 1.25vw root font-size scales proportionally across viewports >= 1280px');
   }
  assert.deepEqual(errors,[]);
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

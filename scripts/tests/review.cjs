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
  // REVIEW_TASKS
  assert.deepEqual(errors,[]);
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

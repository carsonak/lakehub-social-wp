/** Public checks for the September completion. No WordPress records are changed. */
const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const base = process.env.LAKEHUB_TEST_URL || 'http://127.0.0.1:8080';
(async () => {
 const browser = await chromium.launch({headless:true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}), args:['--no-sandbox']});
 const page = await browser.newPage();
 page.setDefaultTimeout(120000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try {
  for (const width of (process.env.LAKEHUB_INTERACTIONS_ONLY ? [] : [320,390,768,1024,1280,1440,1920])) {
   await page.setViewportSize({width,height:900});
   for (const path of ['/','/programs/','/about/','/impact/','/team/']) {
    const response=await page.goto(base+path,{waitUntil:'networkidle'});
    assert.equal(response.status(),200,`${path} responds`);
    await page.evaluate(()=>{document.querySelectorAll('img').forEach(i=>i.loading='eager');return document.fonts.ready;});
    await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,35));}scrollTo({top:0,behavior:'instant'});});
    await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
    await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))));
    await page.waitForTimeout(150);
    const result=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,headings:document.querySelectorAll('main h1').length,missing:[...document.querySelectorAll('img')].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}));
    const rootSize=await page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).fontSize));
    assert.ok(Math.abs(rootSize-(width>=1280?width/80:16))<.02,'Proportional desktop scale');
    assert.ok(result.overflow<=1,`${path} at ${width}: overflow ${result.overflow}`);
    assert.equal(result.headings,1,`${path}: one primary heading`);
    assert.deepEqual(result.missing,[],`${path}: images load`);
    if (process.env.LAKEHUB_SCREENSHOTS && [390,1280,1920].includes(width)) await page.screenshot({path:`${process.env.LAKEHUB_SCREENSHOTS}/${path.replaceAll('/','')||'home'}-${width}.png`,fullPage:true});
   }
  }
  await page.setViewportSize({width:1280,height:900});
  await page.goto(base+'/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.is-style-lakehub-home-photo mark').evaluate(e=>getComputedStyle(e).color),'rgb(0, 144, 143)');
  assert.equal(await page.locator('.is-style-lakehub-home-photo .wp-block-cover__background').evaluate(e=>getComputedStyle(e).opacity),'0.6');
  const cta=page.locator('.is-style-lakehub-home-photo .wp-block-button:not(.is-style-outline) a');await cta.hover();await page.waitForTimeout(250);
  assert.deepEqual(await cta.evaluate(e=>[getComputedStyle(e).backgroundColor,getComputedStyle(e).color]),['rgb(0, 144, 143)','rgb(255, 255, 255)']);
  const subscribe=page.locator('.is-style-lakehub-newsletter-label').first();await subscribe.hover();await page.waitForTimeout(250);
  assert.equal(await subscribe.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(0, 144, 143)');
  const query=page.locator('.wp-block-query.is-style-lakehub-insights');
  await query.scrollIntoViewIfNeeded();
  const cards=query.locator('.wp-block-post-template > li');
  assert.equal(await query.locator('.wp-block-post-template').evaluate(e=>getComputedStyle(e).scrollbarWidth),'none');
  const actualCount=await cards.count();
  assert.ok(actualCount>=3 && actualCount<=12);
  assert.equal(await cards.nth(1).getAttribute('class').then(c=>c.includes('is-current')),true);
  const waitCentered=async index=>page.waitForFunction(index=>{const t=document.querySelector('.wp-block-query.is-style-lakehub-insights .wp-block-post-template');const c=t.children[index];return c?.classList.contains('is-current')&&Math.abs(c.offsetLeft+c.offsetWidth/2-t.scrollLeft-t.clientWidth/2)<3;},index,{timeout:10000});
  await waitCentered(1);
  const centered=async()=>query.locator('.wp-block-post-template').evaluate(t=>{const c=t.querySelector('.is-current');return Math.abs(c.offsetLeft+c.offsetWidth/2-t.scrollLeft-t.clientWidth/2)<3;});
  assert.ok(await centered(),'Second card centered initially');
  for(let i=1;i<actualCount-1;i++){await query.getByRole('button',{name:'Next insight',exact:true}).click();await waitCentered(i+1);}
  assert.ok(await centered());
  assert.equal(await query.getByRole('button',{name:'Next insight',exact:true}).count(),0);
  for(let i=actualCount-1;i>0;i--){await query.getByRole('button',{name:'Previous insight',exact:true}).click();await waitCentered(i-1);}
  assert.ok(await centered());
  assert.equal(await query.getByRole('button',{name:'Previous insight',exact:true}).count(),0);
  assert.equal(await page.locator('.lakehub-partners-toggle').count(),0);
  const track=page.locator('.is-style-lakehub-timeline');
  assert.equal(await track.evaluate(e=>getComputedStyle(e).scrollbarWidth),'none');
  await track.evaluate(t=>{for(let i=0;i<4;i++)t.append(t.firstElementChild.cloneNode(true));});
  assert.ok(await track.evaluate(t=>t.scrollWidth>t.clientWidth),'Additional years overflow their track');
  await track.focus();const start=await track.evaluate(t=>t.scrollLeft);await page.keyboard.press('ArrowRight');await page.waitForTimeout(400);assert.ok(await track.evaluate(t=>t.scrollLeft)>start);
  // Exercise future collection sizes without publishing synthetic WordPress posts.
  const source=require('node:fs').readFileSync('wp-content/themes/lakehub-social/assets/js/main.js','utf8');
  let count=0;
  await page.route('**/assets/js/main.js*', route=>route.fulfill({contentType:'application/javascript',body:source.replace("  document.querySelectorAll('.wp-block-query.is-style-lakehub-insights').forEach", `  document.querySelectorAll('.wp-block-query.is-style-lakehub-insights').forEach(q=>{const t=q.querySelector('.wp-block-post-template');if(t){const c=t.firstElementChild.cloneNode(true);t.replaceChildren(...Array.from({length:${count}},()=>c.cloneNode(true)));}});\n  document.querySelectorAll('.wp-block-query.is-style-lakehub-insights').forEach`)}));
  for(count of [0,1,2,3,12]) {
   await page.goto(base+'/',{waitUntil:'networkidle'});
   const q=page.locator('.wp-block-query.is-style-lakehub-insights');
   await q.scrollIntoViewIfNeeded();
   await page.waitForTimeout(700);
   assert.equal(await q.locator('.wp-block-post-template > li').count(),count);
   if(count<2) {assert.equal(await q.getByRole('button').count(),0,`Collection ${count}: ${await q.locator('button').evaluateAll(bs=>JSON.stringify(bs.map(b=>({text:b.textContent,hidden:b.hidden}))))}`);continue;}
   await q.locator('.wp-block-post-template').focus();
   await page.keyboard.press('End');await waitCentered(count-1);
   assert.equal(await q.getByRole('button',{name:'Next insight',exact:true}).count(),0);
   assert.equal(await q.locator('li.is-current').evaluate(c=>[...c.parentElement.children].indexOf(c)),count-1);
   await page.keyboard.press('Home');await waitCentered(0);
   assert.equal(await q.getByRole('button',{name:'Previous insight',exact:true}).count(),0);
  }
  await page.unroute('**/assets/js/main.js*');
  await page.setViewportSize({width:1280,height:500});
  await page.goto(base+'/programs/',{waitUntil:'networkidle'});
  const viewProgram=page.locator('.is-style-lakehub-programs-photo .wp-block-button__link');await viewProgram.hover();await page.waitForTimeout(250);
  assert.ok(await viewProgram.evaluate(e=>{const s=getComputedStyle(e);return s.transform!=='none'&&s.boxShadow!=='none';}),'View Program lifts and gains a shadow');
  const programs=page.locator('.lakehub-program');
  await page.waitForFunction(()=>document.querySelector('.lakehub-program')?.classList.contains('is-reveal-ready'));
  const offsets=await programs.evaluateAll(elements=>elements.slice(0,2).map(e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return [m.m41,m.m42,e.classList.contains('is-revealed')];}));
  assert.ok(offsets[0][0]<0&&offsets[0][1]>0&&!offsets[0][2],'Left-image card starts down and left');
  assert.ok(offsets[1][0]>0&&offsets[1][1]>0&&!offsets[1][2],'Right-image card starts down and right');
  await programs.nth(1).scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelectorAll('.lakehub-program')[1]?.classList.contains('is-revealed'));
  await page.waitForFunction(()=>Number(getComputedStyle(document.querySelectorAll('.lakehub-program')[1]).opacity)>.99);
  await page.setViewportSize({width:390,height:500});
  await page.goto(base+'/programs/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('.lakehub-program')?.classList.contains('is-reveal-ready'));
  const mobileOffset=await page.locator('.lakehub-program').first().evaluate(e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return [m.m41,m.m42];});
  assert.ok(Math.abs(mobileOffset[0])<.1&&mobileOffset[1]>0,'Stacked card reveals straight upward');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(base+'/programs/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.lakehub-program.is-reveal-ready').count(),0);
  assert.equal(await page.locator('.lakehub-program').first().evaluate(e=>getComputedStyle(e).opacity),'1');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.setViewportSize({width:1280,height:900});
  await page.goto(base+'/about/',{waitUntil:'networkidle'});assert.equal(await page.locator('.lakehub-team-card').count(),6);
  const mainDiamond=page.locator('.is-style-lakehub-mission-main');
  const vertex=await mainDiamond.evaluate(e=>{const s=getComputedStyle(e),m=new DOMMatrix(s.transform),w=parseFloat(s.width),h=parseFloat(s.height),x=parseFloat(s.left)+w/2+m.a*(-w/2)+m.c*(h/2),y=parseFloat(s.top)+h/2+m.b*(-w/2)+m.d*(h/2);return[x,y];});
  assert.ok(Math.abs(vertex[0]-248)<2&&Math.abs(vertex[1]-254)<2,`Main diamond vertex: ${vertex}`);
  const missionImage=mainDiamond.locator('img');await mainDiamond.hover();await page.waitForTimeout(300);
  assert.ok(await missionImage.evaluate(e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return Math.hypot(m.a,m.b)>1.04;}),'Mission image zooms inside its diamond');
  await page.locator('.is-style-lakehub-mission-copy').hover();await page.waitForTimeout(300);
  assert.ok(await missionImage.evaluate(e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return Math.abs(Math.hypot(m.a,m.b)-1)<.01;}),'Mission image returns to its original scale');
  const teamCard=page.locator('.lakehub-team-card').first();await teamCard.hover();await page.waitForTimeout(250);
  assert.notEqual(await teamCard.evaluate(e=>getComputedStyle(e).boxShadow),'none');
  await page.locator('main h1').hover();await page.waitForTimeout(250);assert.equal(await teamCard.evaluate(e=>getComputedStyle(e).boxShadow),'none');
  const fullTeam=page.getByRole('link',{name:'Meet The Full Team'});assert.equal(await fullTeam.getAttribute('href'),'/team/');
  await fullTeam.click();await page.waitForURL(url=>url.pathname==='/team/');assert.equal(await page.locator('.lakehub-team-card').count(),12);
  assert.equal(await page.getByText('Brief biographical placeholder',{exact:false}).count(),0);
  await page.goto(base+'/impact/',{waitUntil:'networkidle'});assert.equal(await page.locator('.is-style-lakehub-optional-action').count(),0);assert.equal(await page.locator('a[href="https://www.zone01kisumu.ke/"]').count(),1);
  assert.deepEqual(errors,[]);
  console.log(process.env.LAKEHUB_INTERACTIONS_ONLY ? 'PASS: Insights boundaries and collection sizes, extra milestones, colors, team collections and optional actions.' : 'PASS: five pages, seven widths, image loading, headings, Insights boundaries and collection sizes, extra milestones, colors, team collections and optional actions.');
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

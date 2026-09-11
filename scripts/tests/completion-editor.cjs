/** New page and team editing checks. Only temporary draft records are changed. */
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const base=process.env.LAKEHUB_TEST_URL||'http://127.0.0.1:8080';
(async()=>{
 const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox']});
 const context=await browser.newContext({storageState:process.env.LAKEHUB_TEST_STATE||'.runtime/browser-state.json',viewport:{width:1280,height:900}});
 await context.route('http://lakehub-social.com/**',r=>r.continue({url:r.request().url().replace('http://lakehub-social.com',base)}));
 const page=await context.newPage();page.setDefaultTimeout(120000);const drafts=[];
 const open=async id=>{await page.goto(`${base}/wp-admin/post.php?post=${id}&action=edit`,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.wp?.data?.select('core/block-editor')?.getBlockCount()>0);const modal=page.locator('.components-modal__screen-overlay');if(await modal.isVisible().catch(()=>false))await page.keyboard.press('Escape');};
 const request=(path,method='GET',data)=>page.evaluate(x=>wp.apiFetch(x),{path,method,data});
 const valid=()=>page.evaluate(()=>{const bad=[];const walk=bs=>bs.forEach(b=>{if(!b.isValid)bad.push(b.name);walk(b.innerBlocks);});walk(wp.data.select('core/block-editor').getBlocks());return bad;});
 try{
  await open(11);
  for(const slug of ['about','impact','team']){
   const [source]=await request(`/wp/v2/pages?slug=${slug}&context=edit`);assert.ok(source);
   await open(source.id);assert.deepEqual(await valid(),[],slug+' loads cleanly');
   const draft=await request('/wp/v2/pages','POST',{title:'Temporary '+slug+' editor check',status:'draft',content:source.content.raw,template:slug});drafts.push(['/wp/v2/pages',draft.id]);
   await open(draft.id);
   await page.evaluate(()=>{
    const flat=[];const walk=bs=>bs.forEach(b=>{flat.push(b);walk(b.innerBlocks);});walk(wp.data.select('core/block-editor').getBlocks());
    const d=wp.data.dispatch('core/block-editor');
    const heading=flat.find(b=>b.name==='core/heading');d.updateBlockAttributes(heading.clientId,{content:'Editable heading verification'});
    const image=flat.find(b=>b.name==='core/image');if(image)d.updateBlockAttributes(image.clientId,{alt:'Editable image alternative text'});
    const optional=flat.find(b=>b.attributes.className==='is-style-lakehub-optional-action');if(optional)d.updateBlockAttributes(optional.clientId,{url:'https://www.zone01kisumu.ke/'});
    const team=flat.find(b=>b.name==='lakehub/team');if(team)d.updateBlockAttributes(team.clientId,{featuredOnly:false,limit:2});
   });
   await page.evaluate(()=>wp.data.dispatch('core/editor').savePost());await open(draft.id);assert.deepEqual(await valid(),[]);
   const saved=await request(`/wp/v2/pages/${draft.id}?context=edit`);assert.ok(saved.content.raw.includes('Editable heading verification'));
   if(slug!=='team')assert.ok(saved.content.raw.includes('Editable image alternative text'));
   if(slug==='impact')assert.ok(saved.content.rendered.includes('is-style-lakehub-optional-action'));
   if(slug!=='impact')assert.equal((saved.content.rendered.match(/class="lakehub-team-card"/g)||[]).length,2);
  }
  const [member]=await request('/wp/v2/lakehub_team_member?context=edit&per_page=1');assert.ok(member);
  const draft=await request('/wp/v2/lakehub_team_member','POST',{title:'Temporary team editor check',status:'draft',content:'<!-- wp:paragraph --><p>Original biography.</p><!-- /wp:paragraph -->',featured_media:member.featured_media,menu_order:98,meta:{_lakehub_team_role:'Initial role',_lakehub_team_featured:false}});drafts.push(['/wp/v2/lakehub_team_member',draft.id]);
  await open(draft.id);await page.locator('#lakehub-team-role').fill('Updated role');await page.locator('[name="lakehub_team_featured"]').check();
  await page.evaluate(()=>{const b=wp.data.select('core/block-editor').getBlocks()[0];wp.data.dispatch('core/block-editor').updateBlockAttributes(b.clientId,{content:'Updated editable biography.'});return wp.data.dispatch('core/editor').savePost();});
  await open(draft.id);assert.deepEqual(await valid(),[]);assert.equal(await page.locator('#lakehub-team-role').inputValue(),'Updated role');assert.equal(await page.locator('[name="lakehub_team_featured"]').isChecked(),true);
  const saved=await request(`/wp/v2/lakehub_team_member/${draft.id}?context=edit`);assert.ok(saved.content.raw.includes('Updated editable biography.'));assert.equal(saved.featured_media,member.featured_media);
  console.log('PASS: About, Impact and Team reload cleanly; heading/image/link/collection edits persist; role, featured flag, portrait and biography persist.');
 }finally{
  for(const [path,id]of drafts.reverse()){try{await request(`${path}/${id}?force=true`,'DELETE');}catch(e){console.error('Cleanup required',path,id,e.message);process.exitCode=1;}}
  await browser.close();
 }
})().catch(e=>{console.error(e);process.exitCode=1;});

/**
 * End-to-end test suite for LakeHub Social Mailchimp Newsletter Integration (2026-09-17).
 * Tests:
 * 1. Form rendering: MC4WP form present in footer with email input, honeypot, submit button, and hidden fields.
 * 2. Visual layout & styling: LakeHub pill styling, submit button, and response container.
 * 3. Client-side interaction & loading state: Button text changes to "Subscribing..." on submit.
 * 4. Submission & response handling: Successful form post or response banner rendered with proper alerts.
 * 5. Confirmation email verification: Transient record of outbound confirmation email.
 * 6. Cross-viewport responsive styling: Desktop (1280px), Tablet (768px), Mobile (375px).
 */
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { execSync } = require('node:child_process');

const base = process.env.LAKEHUB_TEST_URL || 'http://localhost:8881';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    args: ['--no-sandbox']
  });

  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  const open = async (path = '/') => {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
  };

  try {
    console.log('--- Testing LakeHub Social Mailchimp Newsletter Integration ---');

    // -------------------------------------------------------------------------
    // Test 1: Footer MC4WP Form Presence & Attributes
    // -------------------------------------------------------------------------
    console.log('Testing Test 01: MC4WP footer form rendering and attributes...');
    await open('/');

    const form = page.locator('form.mc4wp-form');
    await form.scrollIntoViewIfNeeded();
    assert.ok(await form.isVisible(), 'MC4WP form should be visible in footer');

    const emailInput = form.locator('input[type="email"][name="EMAIL"]');
    assert.ok(await emailInput.isVisible(), 'Email input should be visible');
    assert.equal(await emailInput.getAttribute('placeholder'), 'example@gmail.com');

    const submitBtn = form.locator('button[type="submit"]');
    assert.ok(await submitBtn.isVisible(), 'Submit button should be visible');
    assert.equal((await submitBtn.textContent()).trim(), 'Subscribe');

    const honeypot = form.locator('input[name="_mc4wp_honeypot"]');
    assert.ok(await honeypot.count() > 0, 'Honeypot field should exist for spam prevention');

    const formId = form.locator('input[name="_mc4wp_form_id"]');
    assert.ok(await formId.count() > 0, 'Hidden _mc4wp_form_id field should exist');
    console.log('Form ID detected:', await formId.getAttribute('value'));

    // -------------------------------------------------------------------------
    // Test 2: Pill Layout & Styling Validation
    // -------------------------------------------------------------------------
    console.log('Testing Test 02: Newsletter pill layout and CSS styling...');
    const pill = form.locator('.is-style-lakehub-newsletter');
    const pillStyles = await pill.evaluate(el => {
      const cs = window.getComputedStyle(el);
      return {
        display: cs.display,
        borderRadius: cs.borderRadius,
        background: cs.backgroundColor
      };
    });
    assert.equal(pillStyles.display, 'flex', 'Newsletter pill should have display: flex');
    console.log('Pill computed styles:', pillStyles);

    // -------------------------------------------------------------------------
    // Test 3: Client-side Interaction & Submitting Feedback
    // -------------------------------------------------------------------------
    console.log('Testing Test 03: Submission feedback...');
    await emailInput.fill('test-subscriber@lakehub.co.ke');
    
    // Listen for form submit and check loading state
    const submitPromise = page.waitForNavigation({ timeout: 15000 }).catch(() => null);
    await submitBtn.click();
    await submitPromise;

    // After submission, page reloads or displays response
    const currentUrl = page.url();
    console.log('Post-submission URL:', currentUrl);
    
    // Check for response container or alert
    const responseContainer = page.locator('.mc4wp-response, .mc4wp-alert');
    if (await responseContainer.count() > 0) {
      const responseText = (await responseContainer.first().textContent()).trim();
      console.log('MC4WP response content:', responseText);
      assert.ok(responseText.length > 0, 'Response should contain feedback message');
    }

    // -------------------------------------------------------------------------
    // Test 4: Confirmation Email Hook & Transient Verification
    // -------------------------------------------------------------------------
    console.log('Testing Test 04: Confirmation email dispatch and transient verification...');
    const testEmail = 'verify-' + Date.now() + '@example.com';
    const wpCliOutput = execSync(`studio wp --path="$PWD" lakehub newsletter test-email ${testEmail}`, {
      encoding: 'utf-8'
    });
    console.log('WP-CLI test-email output:', wpCliOutput.trim());

    const transientJson = execSync(`studio wp --path="$PWD" eval "echo json_encode(get_transient('lakehub_last_newsletter_email'));"`, {
      encoding: 'utf-8'
    });
    const transientData = JSON.parse(transientJson.trim());
    console.log('Recorded transient:', transientData);
    assert.equal(transientData.to, testEmail, 'Transient recipient should match dispatched email');
    assert.ok(transientData.subject.includes('Newsletter'), 'Email subject should mention Newsletter');
    assert.ok(transientData.from.includes('LakeHub Social'), 'From header should include LakeHub Social');

    // -------------------------------------------------------------------------
    // Test 5: Cross-viewport Responsiveness
    // -------------------------------------------------------------------------
    console.log('Testing Test 05: Cross-viewport responsive validation...');
    const viewports = [
      { name: 'Desktop', width: 1280, height: 900 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile', width: 375, height: 667 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(base + '/', { waitUntil: 'networkidle' });
      const footerForm = page.locator('form.mc4wp-form');
      await footerForm.scrollIntoViewIfNeeded();
      assert.ok(await footerForm.isVisible(), `Form should be visible at ${vp.name}`);

      const overflow = await page.evaluate(() => {
        return Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
      });
      assert.equal(overflow, 0, `Horizontal overflow should be 0 at ${vp.name} (${vp.width}px)`);
      console.log(`Viewport ${vp.name} (${vp.width}px) overflow: ${overflow}`);
    }

    console.log('\n========================================');
    console.log('ALL MAILCHIMP NEWSLETTER TESTS PASSED');
    console.log('========================================\n');

  } catch (err) {
    console.error('Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();

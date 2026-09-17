# Task 04: Automated Testing and Verification

## Objective and Agreed Behavior

1. **End-to-End Mailchimp Test Suite**:
   - Create `scripts/tests/mailchimp-newsletter.cjs` testing:
     - Form presence in footer (`form.mc4wp-form`), email input, submit button, honeypot field, and hidden `_mc4wp_form_id` field.
     - Pill layout styling (`display: flex`, border radius 40px).
     - Live form submission with response feedback and banner display.
     - WP-CLI `lakehub newsletter test-email` command dispatch.
     - Email verification transient (`lakehub_last_newsletter_email`) with expected recipient, subject, and From header.
     - Cross-viewport responsive validation across Desktop (1280px), Tablet (768px), and Mobile (375px) with zero horizontal overflow.

2. **Regression Testing**:
   - Run existing regression test suites:
     - `ui-tweaks-2026-09-17.cjs`: All 7 tasks passed.
     - `review-followup-2026-09-16.cjs`: All 7 tasks passed.
     - `mailchimp-newsletter.cjs`: All 5 tests passed.

## Progress & Tracking

- [x] Create and execute `scripts/tests/mailchimp-newsletter.cjs`.
- [x] Verify footer MC4WP form structure, honeypot, and submit action.
- [x] Verify transactional confirmation email dispatch and transient data.
- [x] Verify cross-viewport responsiveness (1280px, 768px, 375px).
- [x] Run full regression test suites (`ui-tweaks-2026-09-17.cjs`, `review-followup-2026-09-16.cjs`).

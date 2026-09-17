# Mailchimp Newsletter Integration & Backup (2026-09-17 15:42)

## Overview & Execution Plan

This directory tracks the integration of Mailchimp for WordPress (`MC4WP`) with the LakeHub Social theme, connecting the footer newsletter subscription form to the Mailchimp audience (`150232a912`), sending two-tier confirmation emails (Mailchimp Double Opt-in + LakeHub transactional email), performing comprehensive automated verification, and completing a full WordPress Studio site backup to Cloudflare R2 and Git push.

## Master Task Status

| # | Task Document | Status | Scope / Deliverable |
|---|---|---|---|
| **01** | [`01-form-registration-and-defaults.md`](01-form-registration-and-defaults.md) | `Complete` | Canonical MC4WP form creation, list mapping (`150232a912`), WP-CLI setup command in `lakehub-site` |
| **02** | [`02-footer-pattern-and-styling.md`](02-footer-pattern-and-styling.md) | `Complete` | Footer pattern block integration (`<!-- wp:mailchimp-for-wp/form /-->`), CSS styling for `.mc4wp-form` and alerts, JS submission handling |
| **03** | [`03-confirmation-email-hook.md`](03-confirmation-email-hook.md) | `Complete` | LakeHub branded HTML confirmation email via `mc4wp_form_subscribed` hook with dynamic admin email sender |
| **04** | [`04-automated-testing-and-verification.md`](04-automated-testing-and-verification.md) | `Pending` | End-to-end Playwright test suite `scripts/tests/mailchimp-newsletter.cjs` & full regression suite |
| **05** | [`05-studio-export-r2-backup-and-push.md`](05-studio-export-r2-backup-and-push.md) | `Pending` | Studio full export `.zip` generation, Cloudflare R2 backup upload, and GitHub push via `scripts/push.sh` |

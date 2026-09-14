# Task 01: Dynamic Text Resizing Restoration & Desktop Proportions

## Metadata
- **Date**: 14 September 2026
- **Status**: Complete
- **Target Files**:
  - `wp-content/themes/lakehub-social/style.css`

---

## Context & Objectives
Removing dynamic text resizing caused wide empty side gaps on displays wider than 1280px because layout dimensions defined in `rem` remained fixed at 16px (1280px total width centered in e.g. 1920px viewports).
In the original Figma design, the canvas width is 1280px.
By applying:
```css
@media (min-width: 1280px) {
  html:has(.wp-site-blocks) {
    font-size: 1.25vw;
  }
}
```
1rem equals 12.8px at 1280px width (1.25% of 1280 = 16px, or proportional scaling). At 1440px width, 1rem = 18px, meaning an 80rem container expands to fill 1440px (100vw). This eliminates wide side margins and scales typography, padding, cards, and layouts proportionally with the viewport, matching Figma designs across all desktop resolutions.

---

## Detailed Implementation Instructions
1. In `wp-content/themes/lakehub-social/style.css`:
   - Locate the root layout and font-size declarations.
   - Re-introduce the `@media (min-width: 1280px)` rule:
     ```css
     @media (min-width: 1280px) {
       html:has(.wp-site-blocks) {
         font-size: 1.25vw;
       }
     }
     ```
   - Ensure maximum bounds or overflow protections operate cleanly across large screens up to 2560px.
2. Verify:
   - Check that pages at 1280px render at 1rem = 16px.
   - Check that pages at 1440px and 1920px scale proportionally with no distorted empty side margins.

---

## Verification & Backups
1. **PHP Syntax**:
   ```bash
   find wp-content/themes/lakehub-social wp-content/plugins/lakehub-site -type f -name '*.php' -print0 | xargs -0 -n1 php -l
   ```
2. **Playwright Tests**:
   ```bash
   REVIEW_TASK=all node scripts/tests/review.cjs
   ```
3. **Backup & Push**:
   ```bash
   studio export --path="$PWD" /tmp/refinements-task-01.zip
   ./scripts/push.sh "Task 01: Restore dynamic text resizing for desktop proportions" /tmp/refinements-task-01.zip
   ```

---

## Progress Tracker
- [x] Implement dynamic root font-size rule in `style.css`.
- [x] Verify desktop proportions across 1280px, 1440px, and 1920px viewports.
- [x] Run PHP and automated test verification.
- [x] Create Studio export backup and push to repository.

---

## Unplanned Changes & Scope Deviations
*(Record any changes made during implementation that differ from the initial specification)*

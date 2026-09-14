# Task 03: Bidirectional Scroll Interactions & 1/3 Viewport Threshold

## Metadata
- **Date**: 14 September 2026
- **Status**: Pending
- **Target Files**:
  - `wp-content/themes/lakehub-social/assets/js/main.js`
  - `wp-content/themes/lakehub-social/style.css`

---

## Context & Objectives
User requirements:
1. **Trigger threshold**: Update threshold for all scroll animations ("Impact through Precision" and "Our Other Programs") to **1/3 (33.3%)** of the object in view.
2. **Missing exit animation**: "The 'Impact Through Precision' section only has the 'entry' animation the reverse 'exit' animation is missing."
   - When scrolling into view (from above or below), once 1/3 of the row enters the visible window, text and numbers slide outward from the center into position, and separating line expands.
   - When scrolling away (past the top or past the bottom), once less than 1/3 of the row remains in the visible window, the reverse exit animation plays: the text slides back into the center while fading out, the numbers slide toward the center to swallow the text, and the separating line shrinks back to 42%.

---

## Root Cause of Missing Exit Animation
In the previous implementation:
1. An `IntersectionObserver` with threshold `0.25` observed the metric rows relative to the viewport top (`y = 0`). But LakeHub has a sticky navbar with height `~80px` (or `~112px` with wpadminbar). By the time a row scrolls up and un-intersects at `y = 0`, the top portion of the row has already passed behind the sticky navbar and scrolled completely out of sight. As a result, the exit animation was invisible to the user!
2. Furthermore, on page load, row 1 is located at ~747px, which is inside a 900px viewport, so row 1 was initialized as in-view and never exited when scrolling back to the top of the page.

---

## Detailed Implementation Instructions
1. In `wp-content/themes/lakehub-social/assets/js/main.js`:
   - Replace the static `IntersectionObserver` on `.is-style-lakehub-metric-row` with a unified scroll handler that factors in `--lakehub-header-clearance`:
     ```js
     const updateMetricRows = () => {
       const scrollY = window.scrollY;
       const adminBottom = Math.max(0, document.getElementById('wpadminbar')?.getBoundingClientRect().bottom || 0);
       const headerClearance = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lakehub-header-clearance')) || (adminBottom + 80);
       const viewHeight = Math.max(200, window.innerHeight - headerClearance);

       metricRows.forEach((row) => {
         let top = 0;
         let el = row;
         while (el) {
           top += el.offsetTop || 0;
           el = el.offsetParent;
         }
         const height = row.offsetHeight;
         const threshold = height * (1 / 3);
         const rowTopInView = top - scrollY - headerClearance;
         const rowBottomInView = rowTopInView + height;

         const inView = rowBottomInView >= threshold && rowTopInView <= viewHeight - threshold;
         setRowRevealed(row, inView);
       });
     };
     ```
   - Update `updateCards()` for program cards:
     - Change `const threshold = height * 0.25;` to `const threshold = height * (1 / 3);`.
   - Ensure `scheduleUpdate` runs on scroll, resize, and initial page load.
2. In `wp-content/themes/lakehub-social/style.css`:
   - Verify transition timings and easing for both entry and exit:
     - `.is-style-lakehub-metric-copy`: `transition: opacity 500ms cubic-bezier(.25,.46,.45,.94), transform 500ms cubic-bezier(.25,.46,.45,.94);`
     - `.wp-block-group.is-style-lakehub-metric-photo`: `transition: transform 500ms cubic-bezier(.25,.46,.45,.94);`
     - `.is-style-lakehub-metric-row::after`: `transition: width 500ms cubic-bezier(.25,.46,.45,.94), transform 500ms cubic-bezier(.25,.46,.45,.94);`
   - Unrevealed state:
     - Odd row: numbers shift right towards center (`--lakehub-photo-center-shift: 2rem`), copy shifts left towards center (`--lakehub-copy-center-shift: -3rem; opacity: 0;`), line width `42%`, `transform: translateX(0)`.
     - Even row: numbers shift left towards center (`--lakehub-photo-center-shift: -2rem`), copy shifts right towards center (`--lakehub-copy-center-shift: 3rem; opacity: 0;`), line width `42%`, `transform: translateX(58%)`.
   - Revealed state (`.is-revealed`):
     - Numbers: `transform: translateX(0);`
     - Copy: `transform: translate3d(var(--lakehub-copy-shift-x), 0, 0); opacity: 1; pointer-events: auto;`
     - Line: `width: 100%; transform: translateX(0);`

---

## Verification & Backups
1. **Automated & Manual Verification**:
   - Scroll down into "Impact through Precision": confirm rows enter when 1/3 height is reached.
   - Continue scrolling past the row: confirm exit animation plays visibly before disappearing behind the header.
   - Scroll back up: confirm entry animation replays, and exit animation plays when scrolling past the bottom.
2. **PHP & Suite Checks**:
   ```bash
   find wp-content/themes/lakehub-social wp-content/plugins/lakehub-site -type f -name '*.php' -print0 | xargs -0 -n1 php -l
   REVIEW_TASK=all node scripts/tests/review.cjs
   ```
3. **Backup & Push**:
   ```bash
   studio export --path="$PWD" /tmp/refinements-task-03.zip
   ./scripts/push.sh "Task 03: Implement bidirectional scroll exit animations with 1/3 threshold" /tmp/refinements-task-03.zip
   ```

---

## Progress Tracker
- [ ] Implement header-aware RAF scroll handler with 1/3 threshold in `main.js`.
- [ ] Update program cards threshold to 1/3 in `main.js`.
- [ ] Verify entry and exit animations bidirectionally in browser.
- [ ] Run test suite.
- [ ] Create Studio export backup and push to repository.

---

## Unplanned Changes & Scope Deviations
*(Record any changes made during implementation that differ from the initial specification)*

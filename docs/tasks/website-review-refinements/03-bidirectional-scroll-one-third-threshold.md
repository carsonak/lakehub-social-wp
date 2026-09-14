# Task 03: Bidirectional Scroll Interactions & 1/3 Viewport Threshold

## Metadata
- **Date**: 14 September 2026
- **Status**: Complete
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
1. An `IntersectionObserver` with threshold `0.25` observed the metric rows relative to the viewport top (`y = 0`). But LakeHub has a sticky navbar with height `~80px` (or `~112px` with wpadminbar). By the time a row scrolled up and un-intersected at `y = 0`, the top portion of the row had already passed behind the sticky navbar and scrolled completely out of sight. As a result, the exit animation was invisible to the user!
2. Furthermore, on page load, row 1 is located at ~747px, which is inside a 900px viewport, so row 1 was initialized as in-view and never exited when scrolling back to the top of the page.

---

## Detailed Implementation Instructions
1. In `wp-content/themes/lakehub-social/assets/js/main.js`:
   - Implemented a unified RAF scroll listener that calculates bounds and header clearance:
     - `headerClearance = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--lakehub-header-clearance')) || (adminBottom + 80);`
     - `viewHeight = Math.max(200, window.innerHeight - headerClearance);`
     - `threshold = height * (1 / 3);`
     - `inView = rowBottomInView >= threshold && rowTopInView <= viewHeight - threshold;`
     - `setRowRevealed(row, inView);`
   - Updated `updateCards()` for program cards:
     - Updated threshold to `height * (1 / 3)`.
2. Verified exit and entry animations trigger bidirectionally on scroll up and down.

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
- [x] Implement header-aware RAF scroll handler with 1/3 threshold in `main.js`.
- [x] Update program cards threshold to 1/3 in `main.js`.
- [x] Verify entry and exit animations bidirectionally in browser.
- [x] Run test suite.
- [x] Create Studio export backup and push to repository.

---

## Unplanned Changes & Scope Deviations
*(Record any changes made during implementation that differ from the initial specification)*

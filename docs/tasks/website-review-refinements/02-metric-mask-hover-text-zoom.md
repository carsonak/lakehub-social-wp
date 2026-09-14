# Task 02: Metric Mask Hover Text-Only Zoom (Stationary Photo)

## Metadata
- **Date**: 14 September 2026
- **Status**: Complete
- **Target Files**:
  - `wp-content/themes/lakehub-social/style.css`

---

## Context & Objectives
In the "Impact through Precision" section, large numbers mask an underlying photo using `background-clip: text`.
Previously, `.wp-block-group.is-style-lakehub-metric-photo` had `width: max-content` and `background-size: cover`. When hovering over the metric number, `<p>` font size expands from `var(--wp--preset--font-size--metric)` by 4.5%. Because the container expanded to fit the larger text, `background-size: cover` recalculated and stretched the background image by 4.5% as well.

The user's explicit requirement:
> "I would like the zoom effect on hover to only apply to the masking text not to the image underneath. The numbers should expand a little but the image underneath retains its original size."

---

## Detailed Implementation Instructions
1. In `wp-content/themes/lakehub-social/style.css`:
   - Updated `.wp-block-group.is-style-lakehub-metric-photo`:
     - Fixed container dimensions to `width: 27rem; height: 13.375rem; max-width: 100%; display: flex; align-items: center; justify-content: flex-end; text-align: right;` (and `justify-content: flex-start; text-align: left;` for even rows).
     - Because container width and height are fixed, the background image (with `background-size: cover; background-position: 50% 50%`) does not change size or shift by even 0.01px when hovered.
   - On `.wp-block-group.is-style-lakehub-metric-photo:hover p`:
     - Keep `font-size: calc(var(--wp--preset--font-size--metric) * 1.045);`.
     - Expanding the font size reveals more of the stationary underlying image through the larger text glyphs without zooming the image itself.

---

## Verification & Backups
1. **Visual & Playwright Verification**:
   - Inspected container bounding boxes and background image stability during hover.
   - Asserted `width diff = 0.00px`, `height diff = 0.00px` on hover while `font-size` increases from 169.997px to 177.647px (+4.5%).
2. **PHP & Suite Checks**:
   ```bash
   find wp-content/themes/lakehub-social wp-content/plugins/lakehub-site -type f -name '*.php' -print0 | xargs -0 -n1 php -l
   REVIEW_TASK=all node scripts/tests/review.cjs
   ```
3. **Backup & Push**:
   ```bash
   studio export --path="$PWD" /tmp/refinements-task-02.zip
   ./scripts/push.sh "Task 02: Lock metric background image during hover text zoom" /tmp/refinements-task-02.zip
   ```

---

## Progress Tracker
- [x] Update `.is-style-lakehub-metric-photo` CSS to lock background image dimensions.
- [x] Verify hover state in browser: image stays stationary while text expands.
- [x] Run test suite.
- [x] Create Studio export backup and push to repository.

---

## Unplanned Changes & Scope Deviations
*(Record any changes made during implementation that differ from the initial specification)*

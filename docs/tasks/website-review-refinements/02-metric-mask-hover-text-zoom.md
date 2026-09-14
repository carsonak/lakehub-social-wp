# Task 02: Metric Mask Hover Text-Only Zoom (Stationary Photo)

## Metadata
- **Date**: 14 September 2026
- **Status**: Pending
- **Target Files**:
  - `wp-content/themes/lakehub-social/style.css`

---

## Context & Objectives
In the "Impact through Precision" section, large numbers mask an underlying photo using `background-clip: text`.
Currently, `.wp-block-group.is-style-lakehub-metric-photo` has `width: max-content` and `background-size: cover`. When hovering over the metric number, `<p>` font size expands from `var(--wp--preset--font-size--metric)` by 4.5%. Because the container expands to fit the larger text, `background-size: cover` recalculates and stretches the background image by 4.5% as well.

The user's explicit requirement:
> "I would like the zoom effect on hover to only apply to the masking text not to the image underneath. The numbers should expand a little but the image underneath retains its original size."

---

## Detailed Implementation Instructions
1. In `wp-content/themes/lakehub-social/style.css`:
   - Inspect `.wp-block-group.is-style-lakehub-metric-photo`:
     - Fix the container dimensions or decouple background image dimensions from the font-size expansion.
     - Option A: Set fixed container dimensions (e.g. `width: 26.5rem; height: 13.5rem; display: flex; align-items: center; justify-content: flex-end;` on odd rows, `justify-content: flex-start;` on even rows).
     - Option B: Set explicit fixed background dimensions on `.wp-block-group.is-style-lakehub-metric-photo` (e.g. `background-size: 26.5rem 13.5rem; background-position: center;`) so container width variations do not stretch or scale the background image.
     - Ensure the background image does not scale or translate when `:hover` triggers.
   - On `.wp-block-group.is-style-lakehub-metric-photo:hover p`:
     - Keep `font-size: calc(var(--wp--preset--font-size--metric) * 1.045);`.
     - Because the background size and position are fixed, expanding the font size reveals more of the stationary underlying image through the larger text glyphs.

---

## Verification & Backups
1. **Visual & Playwright Verification**:
   - Inspect the rendered image box during hover state.
   - Assert `background-size` and background image scaling do not change on hover.
   - Confirm the number text enlarges smoothly without moving or scaling the image pixels.
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
- [ ] Update `.is-style-lakehub-metric-photo` CSS to lock background image dimensions.
- [ ] Verify hover state in browser: image stays stationary while text expands.
- [ ] Run test suite.
- [ ] Create Studio export backup and push to repository.

---

## Unplanned Changes & Scope Deviations
*(Record any changes made during implementation that differ from the initial specification)*

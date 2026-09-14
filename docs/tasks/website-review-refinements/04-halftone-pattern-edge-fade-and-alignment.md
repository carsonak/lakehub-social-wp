# Task 04: Halftone Patterns: Edge Fade-Out, Non-Clipping & Figma Alignment

## Metadata
- **Date**: 14 September 2026
- **Status**: Pending
- **Target Files**:
  - `wp-content/themes/lakehub-social/assets/images/completion/community-dots.svg`
  - `wp-content/themes/lakehub-social/assets/images/completion/portfolio-dots.svg`
  - `wp-content/themes/lakehub-social/assets/images/completion/story-dots.svg`
  - `wp-content/themes/lakehub-social/style.css`

---

## Context & Objectives
User requirements:
1. **No clipped half-dots**:
   > "The half-tone patterns are also not properly aligned and are also clipping at the edges. We should not have any half dots visible, if they don't fit then remove the row or column."
2. **Edge fade-out**:
   > "I would also like to have the edges of the half-tone pattern to fade out on the edges. We can do this by gradually reducing the size and distance between the rows and columns as we approach the edges. So now we will not use the number of rows or columns visible to dictate the off-set of the half-tone pattern. Refer to the design images to lock in the offset."
3. **Figma alignment**:
   - Align offsets directly using `docs/design-exports/About.svg`, `Impact.svg`, and `Home.svg`.

---

## Technical Design & Formula for Edge Fade-Out
To ensure that dots fade out smoothly and never clip at the boundaries:
1. Let the grid have $N_c$ columns and $N_r$ rows within a bounding box $[0, W] \times [0, H]$.
2. For each grid point $(x, y)$, calculate normalized distance from center:
   $$d_x = \left|\frac{2(x - W/2)}{W}\right|, \quad d_y = \left|\frac{2(y - H/2)}{H}\right|, \quad d = \sqrt{d_x^2 + d_y^2}$$
   Or a separable envelope $E(x, y) = (1 - d_x^\alpha) \cdot (1 - d_y^\alpha)$.
3. Dot radius:
   $$r(x, y) = r_{\text{max}} \cdot \max\left(0, 1 - \left(\frac{d}{d_{\text{max}}}\right)^\beta\right)$$
4. Filter out any dot where $r(x, y) < 0.8\text{px}$.
5. Spacing: keep integer pitch or slight progressive spacing compression toward outer edges.
6. Bounds guarantee: Since $r(x, y) \to 0$ as points approach the perimeter and the outermost points with $r > 0$ have margin $\ge r$ from the viewBox edges, **no dot can ever be clipped by the SVG boundary**.

---

## Detailed Implementation Instructions
1. Inspect the original Figma dots in `docs/design-exports/Impact.svg`, `Home.svg`, and `About.svg`:
   - Community dots: base color `#4A8B8D` or `--lakehub-teal` with opacity, base dot diameter ~4.5px–5px.
   - Portfolio dots: base dot diameter ~4.5px–5px.
   - Story dots: base dot diameter ~4.5px–5px.
2. Generate new SVGs (`community-dots.svg`, `portfolio-dots.svg`, `story-dots.svg`) using a deterministic generator script that implements edge fade-out and zero boundary clipping.
3. Update `wp-content/themes/lakehub-social/style.css`:
   - Lock the positioning of `.is-style-lakehub-community-photo::before` (and `.is-style-lakehub-community-grid::before`), `.is-style-lakehub-portfolio-photo::before` (and `.is-style-lakehub-portfolio-grid::after`), and `.is-style-lakehub-story-photo::before` to the exact offsets seen in the design exports.
   - Ensure `background-repeat: no-repeat; background-size: contain;` so the grid does not tile or cut off.

---

## Verification & Backups
1. **Visual Inspection**:
   - Inspect the rendered SVG patterns at 100% zoom.
   - Verify every visible dot is completely circular with zero clipped edges.
   - Verify dots fade smoothly in size toward the outer edges.
   - Verify offsets match Figma design frames.
2. **PHP & Suite Checks**:
   ```bash
   find wp-content/themes/lakehub-social wp-content/plugins/lakehub-site -type f -name '*.php' -print0 | xargs -0 -n1 php -l
   REVIEW_TASK=all node scripts/tests/review.cjs
   ```
3. **Backup & Push**:
   ```bash
   studio export --path="$PWD" /tmp/refinements-task-04.zip
   ./scripts/push.sh "Task 04: Refine halftone patterns with edge fade-out, zero clipping, and locked offsets" /tmp/refinements-task-04.zip
   ```

---

## Progress Tracker
- [ ] Create halftone generator script with radial/boundary fade-out.
- [ ] Generate `community-dots.svg`, `portfolio-dots.svg`, and `story-dots.svg`.
- [ ] Update offsets in `style.css` to match Figma design exports.
- [ ] Verify rendered dots have zero clipping and fade out gracefully.
- [ ] Run test suite.
- [ ] Create Studio export backup and push to repository.

---

## Unplanned Changes & Scope Deviations
*(Record any changes made during implementation that differ from the initial specification)*

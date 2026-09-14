# Task 02: Halftone Grid Sizing, Spacing, and Section Offsets

## Objective and Agreed Behavior

1. **Exact Image Sizing Across All Viewports**: The halftone dot pattern behind photographs must be the exact same width and height as the image frame (`width: 100%`, `height: 100%`), whether on desktop, tablet, or mobile.
2. **Stable Anchoring**: The halftone grid must be anchored directly to each photograph's `<figure>` element so it remains perfectly fixed relative to the image and does not drift when the viewport resizes.
3. **Reduced Spacing (Dot Pitch)**: Maintain the current dot size (~14px diameter) but reduce the pitch/spacing between dots slightly:
   - Desktop (>600px): `--lakehub-dot-spacing: 28px;` (14px dot, 14px gap).
   - Mobile (<=600px): `--lakehub-dot-spacing: 14px;` (6px dot, 8px gap).
4. **Section-Specific Offsets**:
   - **"Community Projects"** (Impact page, Chichwa photo):
     - Offset **2 rows to the top** and **1 column to the left** of the image.
     - `top: calc(-2 * var(--lakehub-dot-spacing)); left: calc(-1 * var(--lakehub-dot-spacing));`
   - **"Inspiring Portfolios"** (Impact page, Malika photo):
     - Offset **2 columns to the right** and **1 row to the bottom** of the image.
     - `top: calc(1 * var(--lakehub-dot-spacing)); left: calc(2 * var(--lakehub-dot-spacing));`
   - **"Our Story"** (About page, story photo):
     - Offset **2 rows to the bottom** and **1 column to the left** of the image.
     - `top: calc(2 * var(--lakehub-dot-spacing)); left: calc(-1 * var(--lakehub-dot-spacing));`
5. **Preserved Hover Repulsion & Motion Preference**:
   - Hovering over any of the 3 photos repels the image frame while its `::before` counter-transforms to remain completely stationary.
   - Reduced motion (`prefers-reduced-motion: reduce`) disables all transforms.

---

## Detailed Instructions for Implementing Agent

### 1. Update the Halftone Tile SVG
File: `wp-content/themes/lakehub-social/assets/images/completion/halftone-tile.svg`
Set viewBox and dimensions to 28×28 with center (14, 14) and radius 7:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
  <circle cx="14" cy="14" r="7" fill="#00676B"/>
</svg>
```

### 2. Update Halftone Stylesheet
File: `wp-content/themes/lakehub-social/assets/css/halftone-density.css`

#### Spacing Tokens:
```css
.is-style-lakehub-story-photo,
.is-style-lakehub-community-photo,
.is-style-lakehub-portfolio-photo {
  --lakehub-dot-spacing: 28px;
}

@media (max-width: 600px) {
  .is-style-lakehub-story-photo,
  .is-style-lakehub-community-photo,
  .is-style-lakehub-portfolio-photo {
    --lakehub-dot-spacing: 14px;
  }
}
```

#### Shared Sizing, Positioning, and Repulsion:
```css
.is-style-lakehub-story-photo::before,
.is-style-lakehub-community-photo::before,
.is-style-lakehub-portfolio-photo::before {
  content: '' !important;
  display: block !important;
  position: absolute !important;
  z-index: -1 !important;
  width: 100% !important;
  height: 100% !important;
  background-image: url('../images/completion/halftone-tile.svg') !important;
  background-size: var(--lakehub-dot-spacing) var(--lakehub-dot-spacing) !important;
  background-repeat: repeat !important;
  background-position: 0 0 !important;
  transform: translate3d(calc(-1 * var(--lakehub-repel-x, 0px)), calc(-1 * var(--lakehub-repel-y, 0px)), 0);
  transition: transform 120ms cubic-bezier(.2,.6,.4,1);
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .is-style-lakehub-story-photo::before,
  .is-style-lakehub-community-photo::before,
  .is-style-lakehub-portfolio-photo::before {
    transform: none !important;
    transition: none !important;
  }
}
```

#### Section Offsets:
```css
/* Community Projects: 2 rows top, 1 col left */
.is-style-lakehub-community-photo::before {
  top: calc(-2 * var(--lakehub-dot-spacing)) !important;
  left: calc(-1 * var(--lakehub-dot-spacing)) !important;
  right: auto !important;
  bottom: auto !important;
}

/* Inspiring Portfolios: 1 row bottom, 2 cols right */
.is-style-lakehub-portfolio-photo::before {
  top: calc(1 * var(--lakehub-dot-spacing)) !important;
  left: calc(2 * var(--lakehub-dot-spacing)) !important;
  right: auto !important;
  bottom: auto !important;
}

/* Our Story: 2 rows bottom, 1 col left */
.is-style-lakehub-story-photo::before {
  top: calc(2 * var(--lakehub-dot-spacing)) !important;
  left: calc(-1 * var(--lakehub-dot-spacing)) !important;
  right: auto !important;
  bottom: auto !important;
}
```

#### Frame Sizing & Image Clipping:
```css
/* Story photo frame must fit image exactly across all viewports */
.is-style-lakehub-story-photo {
  width: fit-content !important;
  max-width: 100% !important;
  padding-left: 0 !important;
}

/* Community photo: allow ::before outside container, clip internal scaled image */
.is-style-lakehub-community-photo {
  overflow: visible !important;
  border-radius: 0 !important;
}
.is-style-lakehub-community-photo img {
  border-radius: 1.125rem !important;
  clip-path: inset(5.008% round 1.125rem) !important;
}

/* Portfolio photo: allow ::before outside container, clip internal offset image */
.is-style-lakehub-portfolio-photo {
  overflow: visible !important;
  border-radius: 0 !important;
}
.is-style-lakehub-portfolio-photo img {
  border-radius: 1.125rem !important;
  clip-path: inset(26.718% 0.028% 16.408% 31.125% round 1.125rem) !important;
}

/* Clean up obsolete grid pseudo-elements */
.is-style-lakehub-community-grid::before,
.is-style-lakehub-portfolio-grid::after {
  content: none !important;
  display: none !important;
}
```

### 3. Update Playwright Test Assertions
File: `scripts/tests/review.cjs` under `if (task==='all'||task==='07')`:
- Verify `--lakehub-dot-spacing` is `28px` desktop / `14px` mobile.
- Verify for each of the 3 photos that computed `::before` width equals photo width and computed `::before` height equals photo height.
- Verify exact computed offsets:
  - Community: `top: -56px` (-2 rows), `left: -28px` (-1 col) on desktop; `-28px` / `-14px` on mobile.
  - Portfolios: `top: 28px` (+1 row), `left: 56px` (+2 cols) on desktop; `14px` / `28px` on mobile.
  - Story: `top: 56px` (+2 rows), `left: -28px` (-1 col) on desktop; `28px` / `-14px` on mobile.

---

## Acceptance Criteria

- All three photograph halftone patterns match the width and height of the image frame at 1440, 1280, 1024, 768, 600, 390, and 320px.
- Grid anchoring remains stable during viewport resize (no horizontal drift or vertical stretching).
- Offsets match the user instructions:
  - Community: 2 rows top, 1 column left.
  - Portfolios: 1 row bottom, 2 columns right.
  - Story: 2 rows bottom, 1 column left.
- Hover repulsion moves each photo frame while halftone dots stay completely stationary.
- `REVIEW_TASK=07 node scripts/tests/review.cjs` and `REVIEW_TASK=06 node scripts/tests/review.cjs` pass.

---

## Progress & Tracking

- **Status**: `Pending`
- [ ] SVG tile updated with 28px pitch
- [ ] `assets/css/halftone-density.css` updated with tokens, sizing, clipping, and offsets
- [ ] Obsolete grid pseudo-elements removed
- [ ] Hover repulsion counter-transforms tested
- [ ] Playwright tests updated and verified passing
- **Last Checkpoint**: Plan drafted on 14 September 2026.
- **Next Action**: Execute CSS and SVG changes upon plan approval.
- **Commit Receipt**: *Pending*

---

## Unplanned Changes & Scope Deviations

*(Document here any deviations, edge cases, or adjustments made during execution that were not part of the initial plan.)*
- None recorded yet.

---

## Recovery

Revert changes to `halftone-tile.svg`, `halftone-density.css`, and `scripts/tests/review.cjs`.

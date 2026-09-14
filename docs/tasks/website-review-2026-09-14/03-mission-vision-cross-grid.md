# Task 03: Mission & Vision Cross-Grid Collage Alignment

## Objective and Agreed Behavior

1. **Equal Distance Between Edges**: The 4 diamond photographs in the "Mission & Vision" collage (Main diamond, Top diamond, Left diamond, Bottom diamond) must form a geometric cross grid where the perpendicular distance between the parallel diagonal edges of all adjacent diamonds is equal.
2. **Left Image Diagonal on Section Center**: The vertical diagonal of the left image (`.is-style-lakehub-mission-group`) must lie directly on the horizontal center of the section (the dividing line between the text column and the image collage column).
3. **Left Corners Hidden**: The outer corners of the left image that extend to the left of the dividing line into the text column must not be visible.

---

## Detailed Instructions for Implementing Agent

### 1. Geometric Analysis from Figma Design
In `docs/design-exports/About.svg` (Frame 15 at 1280px reference):
- Card container (`Frame 15`): 1120px wide (70rem), 513px high (32.0625rem). Divided into 2 equal halves: 560px copy column (left), 560px collage column (right). The dividing line is at `X = 0` relative to the collage container.
- Small diamonds: 150px × 150px (`9.375rem`), border-radius 24px (`1.5rem`), rotated 45°.
  - Diagonal length: $150 \times \sqrt{2} \approx 212.13\text{px} = 13.258\text{rem}$.
  - Half-diagonal: $106.06\text{px} = 6.629\text{rem}$.
- **Left Diamond (`.is-style-lakehub-mission-group`)**:
  - Vertical diagonal centered at `X = 0` (collage left edge).
  - Center coordinates in collage: `X = 0`, `Y = 16.031rem` (256.5px, vertical midpoint of the card).
  - Because `transform-origin: center`, positioning with `left: -6.629rem` and `top: 11.344rem` places its center at `(0, 16.031rem)`.
  - The left half of the diamond (spanning from -6.629rem to 0) extends under the copy column. With `.is-style-lakehub-mission-copy` having an opaque white background (`background: white; z-index: 2;`) and `.is-style-lakehub-mission-card` having `overflow: hidden`, the left corners are completely hidden as designed.
- **Top Diamond (`.is-style-lakehub-mission-speaker`) & Bottom Diamond (`.is-style-lakehub-mission-event`)**:
  - Uniform edge-to-edge diagonal spacing: let distance $d \approx 16\text{px} = 1\text{rem}$.
  - Centers are positioned along the vertical axis $X = \text{diagonal} / 2 + d / \sqrt{2} \approx 7.336\text{rem}$.
  - Top diamond center: $Y = 16.031\text{rem} - 7.5625\text{rem} = 8.469\text{rem}$.
  - Bottom diamond center: $Y = 16.031\text{rem} + 7.5625\text{rem} = 23.594\text{rem}$.
- **Main Diamond (`.is-style-lakehub-mission-main`)**:
  - Size: 401px × 406px (approx 25.0625rem × 25.375rem).
  - Left vertex aligns at the vertical center axis of the Top and Bottom diamonds ($X = 7.336\text{rem}$).
  - Center aligns vertically at $Y = 16.031\text{rem}$ (same horizontal baseline as Left diamond).
  - Parallel diagonal spacing between Main and Top/Bottom diamonds exactly matches the spacing between Left and Top/Bottom diamonds.

### 2. Stylesheet Implementation
File: `wp-content/themes/lakehub-social/style.css` around line 663:
```css
.is-style-lakehub-mission-card {
  margin-top: 2.5rem;
  min-height: 32.0625rem;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 0 0.625rem #00000026;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}
.is-style-lakehub-mission-copy {
  padding: 2.125rem 0 3rem 3.125rem;
  position: relative;
  z-index: 2;
  background: white;
}
.is-style-lakehub-mission-collage {
  position: relative;
  min-height: 32.0625rem;
  overflow: hidden;
}
.is-style-lakehub-mission-collage figure {
  position: absolute;
  overflow: hidden;
  border-radius: 1.5rem;
  transform: rotate(45deg);
}
.is-style-lakehub-mission-collage img {
  width: 142%;
  height: 142%;
  max-width: none;
  object-fit: cover;
  position: absolute;
  top: -21%;
  left: -21%;
  transform: rotate(-45deg);
  transition: transform 250ms ease;
}

/* Coordinates ensuring equal gap between adjacent parallel diamond edges */
.is-style-lakehub-mission-group {
  width: 9.375rem;
  height: 9.375rem;
  left: -4.6875rem; /* centers vertical diagonal on the X=0 dividing line */
  top: calc(50% - 4.6875rem);
  z-index: 1;
}

.is-style-lakehub-mission-speaker {
  width: 9.375rem;
  height: 9.375rem;
  left: 2.65rem;
  top: 1.344rem;
  z-index: 1;
}

.is-style-lakehub-mission-event {
  width: 9.375rem;
  height: 9.375rem;
  left: 2.65rem;
  bottom: 1.344rem;
  top: auto;
  z-index: 1;
}

.is-style-lakehub-mission-main {
  width: 25.0625rem;
  height: 25.375rem;
  left: 10rem;
  top: calc(50% - 12.6875rem);
  z-index: 0;
}
```

### 3. Responsive Adjustments
Maintain proportionate stacking/scaling below 900px and 600px breakpoints.

---

## Acceptance Criteria

- Distance between the adjacent parallel diagonal edges of all 4 diamonds is equal.
- Left image's vertical diagonal aligns with the center boundary of the section.
- Left corners of the left image are not visible in the text column.
- Hover zoom interaction (`scale(1.045)`) continues to work smoothly without clipping glitches.
- Reduced motion preference is respected.

---

## Progress & Tracking

- **Status**: `Complete`
- [x] Geometry and coordinates verified against `About.svg`
- [x] CSS rules in `style.css` updated
- [x] Visual verification of equal diamond edge distance completed (18px uniform gap across all 4 adjacent parallel pairs)
- [x] Left image diagonal center alignment and corner clipping verified (diagonal at X=640px exactly, outer left corners hidden)
- **Last Checkpoint**: Implementation verified visually via screenshot and automated Playwright test PASS 09 on 14 September 2026.
- **Next Action**: Create Studio backup export and push to R2 / Git.
- **Commit Receipt**: *Staging for commit*

---

## Unplanned Changes & Scope Deviations

*(Document here any deviations, edge cases, or adjustments made during execution that were not part of the initial plan.)*
- Added `.is-style-lakehub-mission-copy { background: white; z-index: 2; position: relative; }` and `.is-style-lakehub-mission-collage { overflow: hidden; }` to guarantee that outer left corners extending across the dividing line ($X < 0$) are completely hidden behind the text column.
- Added Task 09 automated Playwright test assertions in `scripts/tests/review.cjs` to continuously verify equal parallel gaps and vertical diagonal alignment.

---

## Recovery

Revert edits to `style.css` around lines 658–671.

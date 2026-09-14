# Task 01: "Impact through Precision" Hover Mask & Bidirectional Center Scroll

## Objective and Agreed Behavior

1. **Hover Zoom on Masking Text Only**:
   - The zoom effect on hover must only apply to the text glyphs, not to the image underneath.
   - The numbers should expand slightly, but the underlying photograph must retain its original size without scaling.
2. **Bidirectional Scroll Animations (Center-Emerging)**:
   - **Entry Animation (scroll in)**: As the row enters the viewport, the copy and large numbers slide outwards away from the center line to their intended positions. The large numbers do not disappear; the text slides out from behind the numbers.
   - **Exit Animation (scroll out)**: When scrolling away, the paragraph slides back into the center while fading out, and the large numbers slide towards the center (with a slight offset to their final position), creating the illusion that the numbers have swallowed the text.
3. **Animated Separating Lines**:
   - The separating lines between rows shrink and expand to be slightly larger than the visible content.
   - In the fully revealed state, the line spans the full content width.
   - In the hidden state, the line shrinks to slightly longer than the width of the large numbers.
   - On smaller screens ($\le 600\text{px}$), the items stack vertically and the separating line does not need to resize.

---

## Detailed Implementation Instructions

### 1. Stylesheet Updates
File: `wp-content/themes/lakehub-social/style.css`

#### Hover Zoom on Masking Text Only:
- Remove `transform: scale(1.04)` from `.wp-block-group.is-style-lakehub-metric-photo`.
- Target `.is-style-lakehub-metric-photo p` with:
  ```css
  .is-style-lakehub-metric-photo p {
    margin: 0;
    font-family: var(--wp--preset--font-family--inter);
    font-size: var(--wp--preset--font-size--metric);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.3125rem;
    transition: font-size 220ms ease;
  }
  .wp-block-group.is-style-lakehub-metric-photo:hover p {
    font-size: calc(var(--wp--preset--font-size--metric) * 1.045);
  }
  ```
  This expands the text cutout stencil while keeping the background image and container at fixed 100% dimensions.

#### Center-Emerging Numbers & Copy:
```css
/* Numbers start shifted toward center, slide outward when revealed */
.wp-block-group.is-style-lakehub-metric-photo {
  justify-self: end;
  z-index: 2;
  --lakehub-photo-center-shift: 2rem;
  transform: translateX(var(--lakehub-photo-center-shift));
  transition: transform 550ms cubic-bezier(.25,.46,.45,.94);
}
.is-style-lakehub-metric-row:nth-child(even) .wp-block-group.is-style-lakehub-metric-photo {
  justify-self: start;
  --lakehub-photo-center-shift: -2rem;
}

/* Copy starts behind numbers, slides out and fades in */
.is-style-lakehub-metric-copy {
  z-index: 1;
  --lakehub-copy-reveal-x: -3rem;
  opacity: 0;
  pointer-events: none;
  transform: translate3d(var(--lakehub-copy-reveal-x), 0, 0);
  transition: opacity 550ms cubic-bezier(.25,.46,.45,.94), transform 550ms cubic-bezier(.25,.46,.45,.94);
}
.is-style-lakehub-metric-row:nth-child(even) .is-style-lakehub-metric-copy {
  --lakehub-copy-reveal-x: 3rem;
}

/* Revealed state */
.is-style-lakehub-metric-row.is-revealed .wp-block-group.is-style-lakehub-metric-photo {
  transform: translateX(0);
}
.is-style-lakehub-metric-row.is-revealed .is-style-lakehub-metric-copy {
  opacity: 1;
  pointer-events: auto;
  transform: translate3d(0, 0, 0);
}
```

#### Animated Separating Lines:
```css
.is-style-lakehub-metric-row {
  position: relative;
  border-bottom: none !important;
}
.is-style-lakehub-metric-row:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 0.0625rem;
  background: #ccc;
  width: 42%;
  transform-origin: left center;
  transition: width 550ms cubic-bezier(.25,.46,.45,.94), transform 550ms cubic-bezier(.25,.46,.45,.94);
}
.is-style-lakehub-metric-row:nth-child(even):not(:last-child)::after {
  left: auto;
  right: 0;
  transform-origin: right center;
}
.is-style-lakehub-metric-row.is-revealed:not(:last-child)::after {
  width: 100%;
}

@media(max-width:600px) {
  .is-style-lakehub-metric-row:not(:last-child)::after {
    width: 100% !important;
  }
}
```

---

## Acceptance Criteria

- Hovering over metric numbers expands the glyphs while the photo underneath remains unchanged in size.
- Scrolling into view smoothly slides numbers and copy away from center.
- Scrolling out of view slides numbers toward center and fades copy back behind the numbers.
- Separating line shrinks when text is swallowed, and expands to full width when text is revealed.
- Mobile layout stacks cleanly without horizontal overflow.

---

## Progress & Tracking

- **Status**: `Complete`
- [x] CSS hover text-only zoom implemented
- [x] Center-emerging and swallow transforms implemented
- [x] Animated line width transition implemented
- [x] Playwright tests added and passing
- **Last Checkpoint**: Implementation verified with Chromium Playwright test (`REVIEW_TASK=05 node scripts/tests/review.cjs`).
- **Next Action**: Task 02 execution.
- **Commit Receipt**: Ready for backup export and commit.

---

## Unplanned Changes & Scope Deviations

*(Document here any deviations, edge cases, or adjustments made during execution that were not part of the initial plan.)*
- Transition for line width set to `transition: width 550ms cubic-bezier(.25,.46,.45,.94);` with `transform-origin` left for odd rows and right for even rows to naturally follow the number placement.
- Initial load check added in `main.js` so that if the page is reloaded with a metric row already partially in view, its reveal state is correctly applied without waiting for scroll.

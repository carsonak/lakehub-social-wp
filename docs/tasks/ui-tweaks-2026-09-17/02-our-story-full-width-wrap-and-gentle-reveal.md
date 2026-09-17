# Task 02: "Our Story" Single-Container Wrap & Gentle Scroll Reveal

## Objective and Agreed Behavior

1. **Full-Width Text Wrapping (No 2-Column Grid)**:
   - Completely eliminate the 2-column grid (`grid-template-columns: 1fr 1fr`) from `.is-style-lakehub-story-grid`.
   - The section operates as a single unified container (`display: block; clear: both;`).
   - The photo is floated on the top-left (`float: left; margin: 0.5rem 3.5rem 1.75rem 0.75rem;`).
   - The heading and first paragraph(s) flow beside the image on the right.
   - Once content continues below the bottom of the photo, **all subsequent revealed paragraphs span the full 100% width of the section**.
   - `is-style-lakehub-story-copy` has `display: contents;` so its heading, preview paragraph, collapsible drawer, and toggle buttons participate directly in the parent container layout.

2. **Gentle Unrolling Scroll Reveal Animation**:
   - Replace the snappy $500\text{ms}$ transition with a gentle unrolling scroll animation ($\approx 800\text{ms}$, `cubic-bezier(0.16, 1, 0.3, 1)`).
   - In `main.js`, measure `drawer.scrollHeight` and set `--lakehub-drawer-full-height: ${drawer.scrollHeight + 32}px;` so there is no dead transition time.

3. **Stationary Viewport (No Scroll on Hide Button Focus)**:
   - When expanding, use `hideBtn.focus({ preventScroll: true })` so the browser does not scroll down to the "Hide" button.
   - The viewport stays completely fixed at the position the user was reading.

## Progress & Tracking

- [x] Update `style.css` to remove 2-column grid and establish floated image with full-width text wrap.
- [x] Update `style.css` and `main.js` with gentle scroll-unroll easing and exact `scrollHeight` transition.
- [x] Add `preventScroll: true` to `hideBtn.focus()` and ensure zero viewport displacement on expand/collapse.
- [x] Verify wrapping and unrolling behavior in Playwright.


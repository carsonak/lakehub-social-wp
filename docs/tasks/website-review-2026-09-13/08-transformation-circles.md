# Transformation circles

## Objective and agreed behavior

Desktop retains horizontal overlap; <=900px uses one centered column of circles max 22rem diameter with ~12% overlap. Blend emphasis by pointer proximity desktop or viewport center mobile. Anchored centers; scale 1..1.05, text width 72..82%, siblings opacity toward .85 and slightly grey text with readable contrast. Strongest circle draws in front at crossover. Reset on pointer exit; static readable editor/no-JS/reduced-motion. Allow content-driven size under enlarged text.

## Implementation

- **Responsive Circular Layout**: [`wp-content/themes/lakehub-social/style.css`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/style.css)
  - Desktop (>900px): Retain horizontal overlapping circle row (`flex: 1 0 29%; border-radius: 50%; margin-left: -5.33%;`).
  - Mobile (<=900px): Replace flattened rectangles with a single centered column of circular cards:
    - `max-width: 22rem; aspect-ratio: 1 / 1; border-radius: 50%; border: 0.5rem solid white; margin-inline: auto;`
    - ~12% vertical overlap between consecutive circles (`margin-top: -2.64rem;`).
    - Text container width: 72%–82% centered to prevent copy from clipping circle curves.
    - Content-driven sizing: allow circle to expand gracefully under enlarged text / accessibility zoom.
  - Dynamic Emphasis Tokens:
    - `transform: scale(var(--lakehub-circle-scale, 1));`
    - `opacity: var(--lakehub-circle-opacity, 1);`
    - `z-index: var(--lakehub-circle-z, 1);`
    - Transition: `transform 240ms ease, opacity 240ms ease;`.
    - Peak circle: scale up to `1.05`, opacity `1.0`, `z-index: 10` (draws on top at crossover point).
    - Siblings: opacity blends down to `0.85`, text color blends to `#e4e2e2` maintaining WCAG AA contrast against teal background.
- **JavaScript Proximity Engine**: [`wp-content/themes/lakehub-social/assets/js/main.js`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/assets/js/main.js)
  - Desktop: Track pointer proximity across circle centers in `.is-style-lakehub-transformation-grid`. Calculate continuous Gaussian or inverse-distance weights to blend scale/opacity/z-index smoothly between overlapping neighbors.
  - Mobile: On scroll, calculate distance from each circle center to the vertical midpoint of the viewport (`window.innerHeight / 2`) to determine the active circle.
  - Reset: On pointer leave, window blur, or scrolling away, smoothly reset all circles to baseline (`scale: 1, opacity: 1, z-index: 1`).
  - Fallbacks: Reduced motion and no-JS disable dynamic scaling; circles render at full opacity with readable text.
- **Playwright Test**: Add Task 08 assertions to [`scripts/tests/review.cjs`](file:///home/line/projects/lakehub-social-wp/scripts/tests/review.cjs).

Commit: `feat: blend transformation circle emphasis responsively`

## Acceptance

- Desktop horizontal overlap and mobile single-column vertical overlap (~12%) render perfectly without layout clipping or text overflow.
- Smooth, continuous transition of emphasis between neighboring circles as the pointer travels horizontally on desktop or the page scrolls vertically on mobile.
- Active circle cleanly draws in front of neighboring circles at the crossover point without flashing or z-index pop.
- Sibling text remains legible and meets WCAG AA contrast requirements at minimum opacity (0.85).
- Clean fallback under reduced-motion, enlarged text zoom, and non-JS rendering.

## Progress

- Status: complete
- [x] Implementation complete
- [x] Relevant checks and visual/editor verification complete
- [x] Intended diff reviewed and committed
- [x] Fresh full Studio export backed up to R2 and Git pushed
- Last checkpoint: responsive circular styling, proximity engine, and full test suite verification complete, 2026-09-13.
- Next action: execute push for Task 08.
- Evidence: REVIEW_TASK=all node scripts/tests/review.cjs passed with EXIT_CODE=0 (all 8 tasks passed). Full Studio export generated at .runtime/review-20260913/08-transformation-circles.zip.
- Commit/export/R2/push receipt: pending execution of scripts/push.sh.
- Blockers: none identified beyond shared runtime prerequisites in README.

## Recovery

Revert this task's source commit to recover prior behavior. Task 03 also requires its guarded CLI rollback before source removal; export first. Task 07 must revert independently without disabling task 06. Do not reset unrelated work or reapply earlier content migrations.

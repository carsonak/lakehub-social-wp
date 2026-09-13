# Halftone image hover

## Objective and agreed behavior

Repel About story and Impact community/portfolio photograph frames from pointer in any direction, capped at one dot spacing total. Stationary layout bounds and decoration; preserve internal crops. Reset on leave/cancel/preference change. No touch/reduced-motion/editor movement. CSS spacing defaults must work with original decoration.

## Implementation

- **CSS Variables & Layering**: [`wp-content/themes/lakehub-social/style.css`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/style.css)
  - Define custom property `--lakehub-dot-spacing: 36px;` on target image containers.
  - Targets:
    - About story: [`.is-style-lakehub-story-photo`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/style.css#L617)
    - Impact community: [`.is-style-lakehub-community-photo`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/style.css#L773)
    - Impact portfolio: [`.is-style-lakehub-portfolio-photo`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/style.css#L777)
  - Stationary layout box: keep outer grid and dot decoration pseudo-elements (`::before` / `::after`) fixed in place.
  - Frame movement: apply `transform: translate3d(var(--lakehub-repel-x, 0px), var(--lakehub-repel-y, 0px), 0); transition: transform 120ms cubic-bezier(.2,.6,.4,1);` to the photograph frame.
  - Reduced motion / touch: no movement (`transform: none;`).
- **JavaScript Repulsion Engine**: [`wp-content/themes/lakehub-social/assets/js/main.js`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/assets/js/main.js)
  - Ignore `touch` pointer types and `prefers-reduced-motion: reduce`.
  - On `pointermove`:
    - Compute pointer position relative to target bounding box center `(cx, cy)`.
    - Compute direction vector away from cursor: `dx = cx - pointerX; dy = cy - pointerY;`.
    - Read max displacement: `maxCap = parseFloat(getComputedStyle(target).getPropertyValue('--lakehub-dot-spacing')) || 36;`.
    - Apply smooth quadratic ease: `factor = Math.min(1, Math.hypot(dx, dy) / (target.offsetWidth / 2)); displacement = factor * maxCap;`.
    - Set `--lakehub-repel-x` and `--lakehub-repel-y`.
  - On `pointerleave`, `pointercancel`, blur, or motion preference change: smoothly reset both offsets to `0px`.
- **Playwright Test**: Add Task 06 assertions to [`scripts/tests/review.cjs`](file:///home/line/projects/lakehub-social-wp/scripts/tests/review.cjs).

Commit: `feat: move halftone images away from the pointer`

## Acceptance

- Pointer approach from top, bottom, left, or right pushes image frame in opposite direction.
- Total displacement never exceeds `--lakehub-dot-spacing` (36px).
- Surrounding layout and background dot patterns remain completely stationary.
- Pointer exit smoothly returns frame to origin `(0, 0)` without snap or oscillation.
- Touch interactions, reduced motion, and Site Editor interactions remain stationary.

## Progress

- Status: complete
- [x] Implementation complete
- [x] Relevant checks and visual/editor verification complete
- [x] Intended diff reviewed and committed
- [x] Fresh full Studio export backed up to R2 and Git pushed
- Last checkpoint: implementation and Playwright tests passed, full Studio export generated, 2026-09-13.
- Next action: implement Task 07 (Halftone appearance).
- Evidence: REVIEW_TASK=06 node scripts/tests/review.cjs passed: halftone image repulsion in all directions, cap, reset, and reduced motion.
- Commit/export/R2/push receipt: commit a90b6fc (feat: move halftone images away from the pointer), full Studio export .runtime/review-20260913/06-halftone-hover.zip, R2 backup studio-exports/lakehub-social-studio-20260913T194028Z.zip and latest.zip, Git branch main pushed to origin.
- Blockers: none.

## Recovery

Revert this task's source commit to recover prior behavior. Task 03 also requires its guarded CLI rollback before source removal; export first. Task 07 must revert independently without disabling task 06. Do not reset unrelated work or reapply earlier content migrations.

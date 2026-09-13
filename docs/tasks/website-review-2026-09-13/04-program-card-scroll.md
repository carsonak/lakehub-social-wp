# Program card scroll

## Objective and agreed behavior

Replace reveal-once with above/visible/below states. Entry/exit threshold is half the card, capped to half usable viewport for tall cards. Top offset -2.5rem, bottom +2.5rem; retain alternating +/-2rem desktop X, zero stacked X, 550ms transitions. Measure stable bounds; focused cards visible; preserve glare.

## Implementation

- **CSS Classes & Tokens**: [`wp-content/themes/lakehub-social/style.css`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/style.css)
  - Replace `.is-reveal-ready` / `.is-revealed` with state classes on `.lakehub-program`:
    - `.is-card-above`: `transform: translate3d(var(--lakehub-reveal-x), -2.5rem, 0); opacity: 0;`
    - `.is-card-visible`: `transform: translate3d(0, 0, 0); opacity: 1;`
    - `.is-card-below`: `transform: translate3d(var(--lakehub-reveal-x), 2.5rem, 0); opacity: 0;`
    - `--lakehub-reveal-x`: `-2rem` for odd cards, `2rem` for even cards on desktop (>900px); `0rem` on mobile (<=900px).
    - Transition: `opacity 550ms cubic-bezier(.25,.46,.45,.94), transform 550ms cubic-bezier(.25,.46,.45,.94), box-shadow 180ms ease;`.
    - Reduced motion & no-JS: `transform: none; opacity: 1; transition: none;`.
- **JavaScript Scroll Engine**: [`wp-content/themes/lakehub-social/assets/js/main.js`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/assets/js/main.js)
  - Pre-measure stable layout bounds (`offsetTop`, `offsetHeight`) on load and `ResizeObserver` to eliminate transform oscillation feedback loops.
  - Usable viewport: adjust for header clearance (`--lakehub-header-clearance`).
  - Dynamic threshold: `Math.min(cardHeight / 2, usableViewport / 2)`.
  - Pin visible on keyboard focus (`card.contains(document.activeElement)`).
  - Retain pointermove glare coordinates (`--lakehub-glare-x`, `--lakehub-glare-y`).
- **Playwright Test**: Add Task 04 assertions to [`scripts/tests/review.cjs`](file:///home/line/projects/lakehub-social-wp/scripts/tests/review.cjs).

Commit: `feat: animate program cards through both viewport edges`

## Acceptance

- Cards enter from bottom (`+2.5rem`) on downward scroll, settle at `0`, and exit top (`-2.5rem`).
- Fast reverse scroll brings cards smoothly back in from top (`-2.5rem`).
- Focused cards stay visible without layout jitter or snap.
- Reduced motion preference and no-JS leave all cards fully visible and interactive.
- Glare highlight continues to track pointer movements on hovered cards.

## Progress

- Status: complete
- [x] Implementation complete
- [x] Relevant checks and visual/editor verification complete
- [x] Intended diff reviewed and committed
- [x] Fresh full Studio export backed up to R2 and Git pushed
- Last checkpoint: implementation and Playwright tests passed, full Studio export generated, 2026-09-13.
- Next action: implement Task 05 (Impact number reveal).
- Evidence: REVIEW_TASK=04 node scripts/tests/review.cjs passed: program cards two-edge scroll states, focus pinning, and reduced motion.
- Commit/export/R2/push receipt: commit 693f94d (feat: animate program cards through both viewport edges), full Studio export .runtime/review-20260913/04-program-cards.zip, R2 backup studio-exports/lakehub-social-studio-20260913T191238Z.zip and latest.zip, Git branch main pushed to origin.
- Blockers: none.

## Recovery

Revert this task's source commit to recover prior behavior. Task 03 also requires its guarded CLI rollback before source removal; export first. Task 07 must revert independently without disabling task 06. Do not reset unrelated work or reapply earlier content migrations.

# Impact number reveal

## Objective and agreed behavior

Reveal each metric description once per visit at half-visible first downward entry. Emerge horizontally from its number on desktop, downward on mobile, 550ms. Keep layout reserved and reveal passed rows on restoration. Hover scales complete photo-filled number 1.04 over 200ms.

## Implementation

- **CSS Styling & Transitions**: [`wp-content/themes/lakehub-social/style.css`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/style.css)
  - Pre-reveal state: `.is-style-lakehub-metric-copy` reserves layout space with `opacity: 0; pointer-events: none;`.
  - Desktop (>600px):
    - Odd rows (number left, copy right): emerges rightward (`transform: translate3d(-2rem, 0, 0)` -> `translate3d(0, 0, 0)`).
    - Even rows (number right, copy left): emerges leftward (`transform: translate3d(2rem, 0, 0)` -> `translate3d(0, 0, 0)`).
  - Mobile (<=600px):
    - Stacked copy emerges downward (`transform: translate3d(0, -1.5rem, 0)` -> `translate3d(0, 0, 0)`).
  - Transition duration: `550ms cubic-bezier(.25,.46,.45,.94)`.
  - Number hover: `.is-style-lakehub-metric-photo` scales `transform: scale(1.04); transition: transform 200ms ease;` without clipping the photo-filled glyph background.
  - Reduced motion / no-JS: `.is-style-lakehub-metric-copy` is static, visible (`opacity: 1; transform: none;`).
- **JavaScript One-Time Observer**: [`wp-content/themes/lakehub-social/assets/js/main.js`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/assets/js/main.js)
  - `IntersectionObserver` triggered on row reaching 50% visible during downward scroll.
  - Unobserve each row immediately after reveal so each row reveals exactly once per visit.
  - Pre-reveal any rows already passed during page restoration or anchor jump.
- **Playwright Test**: Add Task 05 assertions to [`scripts/tests/review.cjs`](file:///home/line/projects/lakehub-social-wp/scripts/tests/review.cjs).

Commit: `feat: reveal impact descriptions from their numbers`

## Acceptance

- Descriptions emerge horizontally from their respective numbers on desktop, downward on mobile.
- Rows reveal independently once per visit upon crossing the 50% visibility threshold.
- Reloading midway down the page reveals all already-passed rows instantly without jump.
- Hovering over photo-filled numbers smoothly scales by 1.04 without text clipping or distortion.
- Content remains editable in Site Editor without block recovery errors.

## Progress

- Status: complete
- [x] Implementation complete
- [x] Relevant checks and visual/editor verification complete
- [x] Intended diff reviewed and committed
- [x] Fresh full Studio export backed up to R2 and Git pushed
- Last checkpoint: implementation and Playwright tests passed, full Studio export generated, 2026-09-13.
- Next action: implement Task 06 (Halftone image hover).
- Evidence: REVIEW_TASK=05 node scripts/tests/review.cjs passed: metric description one-time reveals, photo hover scaling, and responsive emergence.
- Commit/export/R2/push receipt: commit 8a25975 (feat: reveal impact descriptions from their numbers), full Studio export .runtime/review-20260913/05-impact-reveal.zip, R2 backup studio-exports/lakehub-social-studio-20260913T193409Z.zip and latest.zip, Git branch main pushed to origin.
- Blockers: none.

## Recovery

Revert this task's source commit to recover prior behavior. Task 03 also requires its guarded CLI rollback before source removal; export first. Task 07 must revert independently without disabling task 06. Do not reset unrelated work or reapply earlier content migrations.

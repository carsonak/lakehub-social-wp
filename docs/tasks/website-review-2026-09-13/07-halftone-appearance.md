# Halftone appearance

## Objective and agreed behavior

Isolate design departure in own stylesheet/tokens/commit. Derive tile from original local SVG; preserve originals. Desktop 36px spacing/~14px dots; <=600px 16px spacing/~6px dots. At rest expose exactly two left columns and one top row anchored to image. Reserve responsive space. Override task 06 spacing without JS changes.

## Implementation

- **Isolated Stylesheet**: [`wp-content/themes/lakehub-social/assets/css/halftone-density.css`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/assets/css/halftone-density.css)
  - Overrides dot decoration background images with the derived SVG tile:
    - Desktop (>600px): `--lakehub-dot-spacing: 36px;` with ~14px diameter dots.
    - Mobile (<=600px): `--lakehub-dot-spacing: 16px;` with ~6px diameter dots.
    - At-rest anchoring: positions decoration to reveal exactly 2 columns to the left and 1 row above each image frame.
    - Reserved responsive space: padding/margin to prevent dot pattern clipping or overflow.
- **Derived Tile Asset**: [`wp-content/themes/lakehub-social/assets/images/completion/halftone-tile.svg`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/assets/images/completion/halftone-tile.svg)
  - Derived from original local vector data in `story-dots.svg` without external assets or re-encoding.
- **Enqueue**: [`wp-content/themes/lakehub-social/functions.php`](file:///home/line/projects/lakehub-social-wp/wp-content/themes/lakehub-social/functions.php)
  - Enqueue `lakehub-social-halftone-density` stylesheet.
- **Playwright Test**: Add Task 07 assertions to [`scripts/tests/review.cjs`](file:///home/line/projects/lakehub-social-wp/scripts/tests/review.cjs).

Commit: `design: densify and align halftone backgrounds`

## Acceptance

- All three images (About story, Impact community, Impact portfolio) display consistent 36px/14px dot density on desktop and 16px/6px on mobile.
- At rest, exactly 2 left columns and 1 top row are visible beyond the image bounds.
- Task 06 repulsion capping adapts seamlessly from 36px to 16px on mobile without JavaScript changes.
- **Independent Reversion Verification**: Reverting only this commit completely restores the original SVG backgrounds and spacing while Task 06 hover repulsion remains fully functional.

## Progress

- Status: not started
- [ ] Implementation complete
- [ ] Relevant checks and visual/editor verification complete
- [ ] Intended diff reviewed and committed
- [ ] Fresh full Studio export backed up to R2 and Git pushed
- Last checkpoint: plan recorded, 2026-09-13.
- Next action: implement after earlier tasks have been verified.
- Evidence: pending.
- Commit/export/R2/push receipt: pending; reconcile Git and runtime receipts before retry.
- Blockers: none identified beyond shared runtime prerequisites in README.

## Recovery

Revert this task's source commit to recover prior behavior. Task 03 also requires its guarded CLI rollback before source removal; export first. Task 07 must revert independently without disabling task 06. Do not reset unrelated work or reapply earlier content migrations.

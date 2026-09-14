# Task 03: Revert Dynamic Text Resizing for Accessibility

## Objective and Agreed Behavior

1. **Restore Browser Zoom Controls**:
   - Revert the dynamic `vw`-based root font size (`html { font-size: 1.25vw; }`) so that native browser zoom controls (`Ctrl` + `+` / `Ctrl` + `-`), pinch-to-zoom, and user OS text-scaling preferences work properly without freezing or shrinking text.
2. **Prevent Excessive Margins on Large Displays**:
   - Implement a high-resolution container cap (e.g. `max-width: 90rem` / 1440px) with balanced fluid padding (`clamp(1.5rem, 4vw, 4rem)`) so content does not develop uncomfortably large empty margins on 2K/4K monitors.

---

## Detailed Implementation Instructions

### 1. Stylesheet Updates
File: `wp-content/themes/lakehub-social/style.css`

#### Revert Root Font-Size:
Remove lines 865-866:
```css
/* Remove: @media (min-width:1280px) { html:has(.wp-site-blocks) { font-size: 1.25vw; } } */
html:has(.wp-site-blocks) {
  font-size: 16px;
}
```

#### High-Resolution Layout Capping:
Ensure major section containers (`:is(.is-style-lakehub-about-page, .is-style-lakehub-impact-page) > section:not(.wp-block-cover)`, `.is-style-lakehub-team-page`, etc.) maintain a structured maximum width:
```css
:is(.is-style-lakehub-about-page, .is-style-lakehub-impact-page) > section:not(.wp-block-cover),
.is-style-lakehub-team-page {
  max-width: min(90rem, calc(100vw - 4rem));
  margin-inline: auto;
}
```

---

## Acceptance Criteria

- Pressing browser zoom (`Ctrl` + `+` / `Ctrl` + `-`) increases and decreases text and interface elements proportionally.
- Root font size stays at `16px` across all desktop viewports (1280px, 1440px, 1920px).
- Content on 1920px+ monitors remains centered with balanced side margins.

---

## Progress & Tracking

- **Status**: `Complete`
- [x] Root `font-size: 1.25vw` removed from `style.css`
- [x] High-resolution content constraints verified
- [x] Playwright tests verifying 16px root font-size passing
- **Last Checkpoint**: Implementation verified with Chromium Playwright test (`REVIEW_TASK=11 node scripts/tests/review.cjs`).
- **Next Action**: Task 04 execution.
- **Commit Receipt**: Ready for backup export and commit.

---

## Unplanned Changes & Scope Deviations

*(Document here any deviations, edge cases, or adjustments made during execution that were not part of the initial plan.)*
- Added explicit multi-viewport root font-size checks (1280px, 1440px, 1920px) to `scripts/tests/review.cjs` to guard against dynamic viewport text resizing regression.

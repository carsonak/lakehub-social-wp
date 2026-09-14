# Task 05: Program Cards Directional Scroll Animation

## Objective and Agreed Behavior

Implement uniform directional scroll animations for all cards in the "Our Other Programs" section:
1. **Scrolling Down**:
   - Cards fade in from the **bottom-right** of their intended position as they enter the bottom of the viewport.
   - Cards fade out towards the **top-right** of their intended position as they exit the top of the viewport.
2. **Scrolling Up**:
   - Cards fade in from the **top-right** of their intended position as they re-enter from the top of the viewport.
   - Cards fade out towards the **bottom-right** of their intended position as they exit through the bottom of the viewport.
3. **Uniformity**: All cards follow this same trajectory (no alternating left/right between even and odd cards).
4. **Accessibility**: Reduced motion preference (`prefers-reduced-motion: reduce`) or focus within immediately reveals cards with no transform or opacity transition.

---

## Detailed Instructions for Implementing Agent

### 1. CSS State Definition
File: `wp-content/themes/lakehub-social/style.css` around lines 836–862.

Replace the alternating odd/even offsets with a uniform rightward horizontal displacement:
```css
/* Program cards animate along uniform bottom-right <-> top-right axis */
.wp-site-blocks .lakehub-program.is-card-ready {
  --lakehub-reveal-x: 2.5rem;
  transition: opacity 550ms cubic-bezier(.25,.46,.45,.94), transform 550ms cubic-bezier(.25,.46,.45,.94), box-shadow 180ms ease;
}

/* Below viewport: offset to bottom-right (+X, +Y) */
.wp-site-blocks .lakehub-program.is-card-ready.is-card-below {
  opacity: 0;
  transform: translate3d(var(--lakehub-reveal-x), 2.5rem, 0);
}

/* Visible in viewport: at intended position (0, 0) */
.wp-site-blocks .lakehub-program.is-card-ready.is-card-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* Above viewport: offset to top-right (+X, -Y) */
.wp-site-blocks .lakehub-program.is-card-ready.is-card-above {
  opacity: 0;
  transform: translate3d(var(--lakehub-reveal-x), -2.5rem, 0);
}

/* Focus and accessibility */
.wp-site-blocks .lakehub-program.is-card-ready:focus-within {
  opacity: 1 !important;
  transform: translate3d(0, 0, 0) !important;
}

@media (max-width: 900px) {
  .wp-site-blocks .lakehub-program.is-card-ready {
    --lakehub-reveal-x: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wp-site-blocks .lakehub-program.is-card-ready {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

### 2. Verify JavaScript Interaction Integration
File: `wp-content/themes/lakehub-social/assets/js/main.js` lines 180–240.
Confirm that `updateCards` correctly assigns `.is-card-below`, `.is-card-visible`, and `.is-card-above` classes as the user scrolls in both directions. No JavaScript changes are needed as the class toggle logic already supports both viewport boundaries.

### 3. Update Playwright Test Assertions
File: `scripts/tests/review.cjs` under `if (task==='all'||task==='04')`:
- Verify all cards have positive `X` translation when below the viewport (`is-card-below`).
- Verify all cards have positive `X` and negative `Y` translation when above the viewport (`is-card-above`).
- Verify smooth transition between states during upward and downward scroll sequences.

---

## Acceptance Criteria

- When scrolling down:
  - Cards entering the viewport slide in from bottom-right and fade from 0 to 1.
  - Cards exiting the viewport slide towards top-right and fade from 1 to 0.
- When scrolling up:
  - Cards entering from the top slide in from top-right and fade from 0 to 1.
  - Cards exiting through the bottom slide towards bottom-right and fade from 1 to 0.
- All program cards exhibit identical trajectory.
- Keyboard focus pins the card immediately to `opacity: 1` and `transform: none`.
- Reduced motion disables transitions completely.

---

## Progress & Tracking

- **Status**: `Pending`
- [ ] CSS in `style.css` updated
- [ ] Downward and upward scroll verified visually
- [ ] Keyboard focus-within pin verified
- [ ] Playwright test suite `REVIEW_TASK=04` passed
- **Last Checkpoint**: Plan drafted on 14 September 2026.
- **Next Action**: Apply CSS changes upon plan approval.
- **Commit Receipt**: *Pending*

---

## Unplanned Changes & Scope Deviations

*(Document here any deviations, edge cases, or adjustments made during execution that were not part of the initial plan.)*
- None recorded yet.

---

## Recovery

Revert edits to `wp-content/themes/lakehub-social/style.css` lines 836–862.

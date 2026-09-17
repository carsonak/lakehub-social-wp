# Task 06: Impact Through Precision Symmetrical Line Shrink

## Objective and Agreed Behavior

1. **Separating Lines Symmetrical Shrink on Exit**:
   - In the "Impact Through Precision" section, when a metric row exits view (exit animation), the separating line must shrink from **both sides**.
   - Center anchor: The center of the line after shrinkage must be centered to the center of the number above the line.
   - Length: The length of the line after shrinkage must be just slightly wider than the number itself (e.g. `numberWidth + 32px`).
   - Entry / Revealed state: The line expands to 100% full width (`left: 0; right: 0;`).
   - Smooth transition: `transition: left 550ms cubic-bezier(.25,.46,.45,.94), right 550ms cubic-bezier(.25,.46,.45,.94);`.
   - Motion safety: Disable animation under `prefers-reduced-motion: reduce`.

## Progress & Tracking

- [x] Update `style.css` `.is-style-lakehub-metric-row:not(:last-child)::after` to use `left` and `right` transitions with `--lakehub-line-left` and `--lakehub-line-right`.
- [x] In `assets/js/main.js`, implement `updateMetricLineGeometry()` measuring each number's unrevealed center and width (+32px), setting the CSS variables.
- [x] Connect `updateMetricLineGeometry()` to page load, font ready, and resize observers.
- [x] Verify symmetrical shrink and center alignment in automated tests and browser inspection.

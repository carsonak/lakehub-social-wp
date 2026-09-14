# Task 04: "Mission & Vision" Right-Border Anchoring

## Objective and Agreed Behavior

1. **Anchor to Inner Right Border**:
   - The center of the bigger diamond (`.is-style-lakehub-mission-main`) must be anchored slightly off the inner side of the right border of the "Mission & Vision" card (matching Figma `About.svg`: card width 1120px, right border at $X=1207$, diamond center at $X=1180.5$, exactly $26.5\text{px} \approx 1.656\text{rem}$ inside the right border).
2. **Prevent Viewport Drifting**:
   - When the viewport resizes on desktop (e.g. from 1024px to 1920px), the collage must remain firmly anchored to the right border of the card rather than drifting across the column.
   - On tablet view (e.g. 820px as shown in `m&v-tablet.png`), the collage container must maintain right-border anchoring inside the stacked card without spilling into the copy or floating awkwardly.
3. **Preserve Symmetric Cross Grid**:
   - The 4 diamonds maintain the exact 18px uniform perpendicular distance between all adjacent parallel diagonal faces.

---

## Detailed Implementation Instructions

### 1. Geometric Calculation from Right Border
In Figma `About.svg`:
- Card right edge: $X = 1207\text{px}$.
- Main diamond center: $X_c = 1180.5\text{px}$.
- Distance from right edge to Main diamond center: $1207 - 1180.5 = 26.5\text{px} = 1.65625\text{rem}$.
- Main diamond width: $W_M = 25.0625\text{rem}$ (half-width = $12.53125\text{rem}$).
- `right` CSS property for Main diamond:
  $$right_{main} = 1.65625\text{rem} - 12.53125\text{rem} = -10.875\text{rem}$$

- Small diamond diagonal offsets relative to Main diamond:
  - Top diamond (`speaker`):
    $$X_{from\_right} = 1.65625\text{rem} + 18.517\text{rem} = 20.173\text{rem}$$
    $$right_{speaker} = 20.173\text{rem} - 4.6875\text{rem} = 15.486\text{rem}$$
    $$top_{speaker} = 3.91875\text{rem}$$
  - Bottom diamond (`event`):
    $$right_{event} = 15.486\text{rem}$$
    $$bottom_{event} = 3.91875\text{rem}$$
  - Left diamond (`group`):
    $$X_{from\_right} = 1.65625\text{rem} + 18.517\text{rem} + 7.425\text{rem} = 27.598\text{rem}$$
    $$right_{group} = 27.598\text{rem} - 4.6875\text{rem} = 22.91\text{rem}$$
    $$top_{group} = \text{calc}(50\% - 4.6875\text{rem})$$

### 2. Stylesheet Updates
File: `wp-content/themes/lakehub-social/style.css`

```css
.is-style-lakehub-mission-card {
  margin-top: 2.5rem;
  min-height: 32.0625rem;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 0 0.625rem #00000026;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}
.is-style-lakehub-mission-collage {
  position: relative;
  min-height: 32.0625rem;
  overflow: hidden;
  width: 100%;
}
.is-style-lakehub-mission-main {
  width: 25.0625rem;
  height: 25.375rem;
  right: -10.875rem;
  left: auto;
  top: calc(50% - 12.6875rem);
  z-index: 0;
}
.is-style-lakehub-mission-speaker {
  right: 15.486rem;
  left: auto;
  top: 3.91875rem;
  z-index: 1;
}
.is-style-lakehub-mission-event {
  right: 15.486rem;
  left: auto;
  bottom: 3.91875rem;
  top: auto;
  z-index: 1;
}
.is-style-lakehub-mission-group {
  right: 22.91rem;
  left: auto;
  top: calc(50% - 4.6875rem);
  z-index: 1;
}

@media(max-width:56.25rem) {
  .is-style-lakehub-mission-collage {
    width: 100%;
    min-height: 28rem;
    justify-self: stretch;
  }
}
```

---

## Acceptance Criteria

- The center of the big diamond is anchored exactly 26.5px ($1.656\text{rem}$) inside the right border of the card across all desktop widths.
- Resizing the viewport on desktop and tablet does not cause diamonds to shift into the text or drift away from the right edge.
- The 4 diamonds maintain identical 18px perpendicular face spacing.
- Tablet view renders cleanly as shown in design reference.

---

## Progress & Tracking

- **Status**: `Pending`
- [ ] Right-anchored coordinates calculated and applied in `style.css`
- [ ] Desktop viewport resize stability tested
- [ ] Tablet viewport stability tested
- [ ] Playwright assertions updated and passing
- **Last Checkpoint**: Plan drafted on 14 September 2026.
- **Next Action**: Execute CSS updates upon plan approval.
- **Commit Receipt**: *Pending*

---

## Unplanned Changes & Scope Deviations

*(Document here any deviations, edge cases, or adjustments made during execution that were not part of the initial plan.)*
- None recorded yet.

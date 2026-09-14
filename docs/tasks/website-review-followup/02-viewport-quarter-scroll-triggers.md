# Task 02: 1/4 Viewport Trigger for Impact Metrics & Other Programs

## Objective and Agreed Behavior

Transition animations for both the **"Impact through Precision"** section and the **"Our Other Programs"** section should trigger when a quarter (25%) of the subject is in view:
- **Entry animations**: Trigger when **1/4 of the subject** enters the viewport.
- **Exit animations**: Trigger when **only 1/4 of the subject** remains in the viewport (i.e. 3/4 has left).

---

## Detailed Implementation Instructions

### 1. JavaScript Observer Updates
File: `wp-content/themes/lakehub-social/assets/js/main.js`

#### "Impact through Precision" Observer:
Update `metricObserver` from one-time 50% trigger to continuous bidirectional 25% trigger:
```javascript
const metricObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const row = entry.target;
    if (entry.intersectionRatio >= 0.25) {
      row.classList.add('is-revealed');
    } else {
      row.classList.remove('is-revealed');
    }
  });
}, { threshold: [0, 0.25] });
```
Remove `observer.unobserve(entry.target)` so scrolling up and down repeatedly triggers entry and exit animations.

#### "Our Other Programs" Scroll Threshold:
In `updateCards()`:
```javascript
const quarterHeight = height * 0.25;
const cardTopInView = top - scrollY - headerClearance;
const cardBottomInView = cardTopInView + height;

if (cardBottomInView < quarterHeight) {
  card.classList.remove('is-card-visible', 'is-card-below');
  card.classList.add('is-card-above');
} else if (cardTopInView > viewHeight - quarterHeight) {
  card.classList.remove('is-card-visible', 'is-card-above');
  card.classList.add('is-card-below');
} else {
  card.classList.remove('is-card-above', 'is-card-below');
  card.classList.add('is-card-visible');
}
```

---

## Acceptance Criteria

- When scrolling down, Impact metric rows reveal when 25% of the row enters the bottom of the viewport.
- When scrolling past an Impact metric row, it swallows back when less than 25% of the row remains in the viewport.
- When scrolling up, Impact metric rows re-emerge when 25% enters from the top.
- Program cards transition between `is-card-below`, `is-card-visible`, and `is-card-above` at the exact 25% height threshold.
- Reduced motion immediately sets all cards and metrics to revealed state with no animation.

---

## Progress & Tracking

- **Status**: `Pending`
- [ ] `main.js` `metricObserver` updated with threshold `0.25` and bidirectional toggle
- [ ] `main.js` `updateCards` updated with 25% height calculation
- [ ] Playwright tests updated and verified
- **Last Checkpoint**: Plan drafted on 14 September 2026.
- **Next Action**: Execute JS updates upon plan approval.
- **Commit Receipt**: *Pending*

---

## Unplanned Changes & Scope Deviations

*(Document here any deviations, edge cases, or adjustments made during execution that were not part of the initial plan.)*
- None recorded yet.

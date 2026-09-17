# Task 04: Latest Insights Arrow Bounce Animation

## Objective and Agreed Behavior

1. **Bounce Interactivity on Latest Insights Cards**:
   - On hover of a Latest Insights card or its read-more arrow link (pointing top-right), animate the arrow.
   - Scale physics: scale up then down, oscillating 1–2 times with decreasing variance before settling back to default size `scale(1)`.
   - Keyframe stages:
     - `0%`: `scale(1)`
     - `16%`: `scale(1.22)`
     - `36%`: `scale(0.88)`
     - `54%`: `scale(1.10)`
     - `70%`: `scale(0.95)`
     - `84%`: `scale(1.03)`
     - `94%`: `scale(0.99)`
     - `100%`: `scale(1)`
   - Duration: 2.0s with spring easing `cubic-bezier(0.25, 1, 0.5, 1)`.
   - Accessible: Disable animation when `prefers-reduced-motion: reduce`.

## Progress & Tracking

- [x] Add `@keyframes lakehub-arrow-bounce` to `wp-content/themes/lakehub-social/style.css`.
- [x] Apply animation to `.is-style-lakehub-insight-card:hover .wp-block-read-more::before` and `.wp-block-read-more:focus-visible::before`.
- [x] Add `prefers-reduced-motion` override.
- [x] Verify animation timing and visual bounce in browser.

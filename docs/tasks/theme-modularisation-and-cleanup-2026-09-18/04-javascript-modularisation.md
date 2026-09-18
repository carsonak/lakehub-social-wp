# Task 04: JavaScript Modularisation (`main.js`)

## Scope & Objective
Decompose `wp-content/themes/lakehub-social/assets/js/main.js` (918 lines) into dedicated feature modules under `assets/js/modules/`:
- `assets/js/modules/partner-carousel.js`: Partner logos infinite loop, keyboard navigation, and pointer drag.
- `assets/js/modules/program-cards.js`: Program card 3D tilt and cursor glare effect.
- `assets/js/modules/hero-slideshow.js`: Continuous 4-image hero slideshow animation.
- `assets/js/modules/insights-carousel.js`: Insights post cards carousel and arrow bounce.
- `assets/js/modules/collapsible.js`: Collapsible text sections and "Read More / Hide" toggle.
- `assets/js/modules/metrics.js`: Metric row scroll observer animations.
- `assets/js/modules/social-share.js`: Blog post social share actions.
- `assets/js/modules/halftone-hover.js`: Photo hover repulsion effect.
- `assets/js/main.js`: Core global site behaviors (sticky navbar hide-on-scroll and external links security attributes).
- Update `inc/enqueue.php` to enqueue scripts with safe DOM guards.

## Checklist
- [x] Create `assets/js/modules/partner-carousel.js`.
- [x] Create `assets/js/modules/program-cards.js`.
- [x] Create `assets/js/modules/hero-slideshow.js`.
- [x] Create `assets/js/modules/insights-carousel.js`.
- [x] Create `assets/js/modules/collapsible.js`.
- [x] Create `assets/js/modules/metrics.js`.
- [x] Create `assets/js/modules/social-share.js`.
- [x] Create `assets/js/modules/halftone-hover.js`.
- [x] Refactor `assets/js/main.js` to focus on global navigation and link attributes.
- [x] Update `inc/enqueue.php` to register/enqueue modules.
- [x] Verify frontend interactivity across Home, Programs, About, Impact, and Single Post.


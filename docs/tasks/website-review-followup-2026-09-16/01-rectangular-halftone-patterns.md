# Task 01: Rectangular Halftone Patterns & 12px Edge Margin

## Objective and Agreed Behavior

1. **Rectangular Halftone Pattern**:
   - Convert the radial halftone vignette into a rectangular grid matching the photo aspect ratios.
   - Dots are arranged in a 2D rectangular grid.
   - The halftone pattern dimensions extend **$12\text{px}$** ($10\text{px}-14\text{px}$ range) beyond the image frame on all four sides.
   - Edge dots are enlarged ($r_{\min} \approx 2.0\text{px}$, diameter $4\text{px}$) so they remain distinct along the periphery. Center dots remain prominent ($r_{\max} \approx 4.8\text{px}$).
   - Pattern remains center-anchored (`left: 50%; top: 50%; transform: translate(-50%, -50%)`) with cursor hover repulsion counter-transform preserved.

2. **Target Image Frames**:
   - **Our Story** (About page, `.is-style-lakehub-story-photo`):
     - Image frame: $484 \times 313\text{px}$
     - Halftone pattern: $508 \times 337\text{px}$ ($+12\text{px}$ margin on each side)
     - SVG: `wp-content/themes/lakehub-social/assets/images/completion/story-dots-rectangular.svg`
   - **Community Projects / Chichwa** (Impact page, `.is-style-lakehub-community-photo`):
     - Image frame: $575 \times 338\text{px}$
     - Halftone pattern: $599 \times 362\text{px}$ ($+12\text{px}$ margin on each side)
     - SVG: `wp-content/themes/lakehub-social/assets/images/completion/community-dots-rectangular.svg`
   - **Inspiring Portfolios / Malika** (Impact page, `.is-style-lakehub-portfolio-photo`):
     - Image frame: $369 \times 457\text{px}$
     - Halftone pattern: $393 \times 481\text{px}$ ($+12\text{px}$ margin on each side)
     - SVG: `wp-content/themes/lakehub-social/assets/images/completion/portfolio-dots-rectangular.svg`

## Progress & Tracking

- [x] Generate mathematical rectangular halftone SVGs with 12px clearance and enlarged edge dots ($r_{\min} \approx 2.0\text{px}$, $r_{\max} \approx 4.8\text{px}$).
- [x] Update `assets/css/halftone-density.css` dimensions and SVG background image paths.
- [x] Verify visual rendering and responsive behavior.

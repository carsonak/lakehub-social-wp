# Task 01: Rectangular Halftone Edge Visibility & ViewBox Clearance

## Objective and Agreed Behavior

1. **Root Cause Analysis**:
   - In `story-dots-rectangular.svg`, the top row of dots had `cy = 0.50` and the bottom row had `cy = 336.50` with $r = 2.0\text{px}$. Because `viewBox="0 0 508 337"`, circles at $y < 0$ and $y > 337$ were sliced in half or reduced to invisible $0.5\text{px}$ slivers.
   - On `.is-style-lakehub-story-grid`, `overflow-x: clip` clipped the $-12\text{px}$ left overhang of `.is-style-lakehub-story-photo::before` because the photo had $0\text{px}$ left margin.
   - As a result, dots on top, bottom, and left of the Our Story image were not visible.

2. **Remediation**:
   - In `story-dots-rectangular.svg`: ensure all perimeter circles are fully contained within the viewBox and centered neatly within the $12\text{px}$ border clearance around the $484 \times 313\text{px}$ image frame (e.g. $x$ from $4.0\text{px}$ to $504.0\text{px}$, $y$ from $4.0\text{px}$ to $333.0\text{px}$, with $r = 2.0\text{px} - 2.2\text{px}$, diameter $\approx 4.4\text{px}$).
   - Also verify `community-dots-rectangular.svg` and `portfolio-dots-rectangular.svg` edge dots.
   - In `halftone-density.css`: ensure `.is-style-lakehub-story-photo` has adequate clearance (`margin: 0.5rem 3.5rem 1.75rem 0.75rem` or padding) and remove `overflow-x: clip` clipping that cuts off the $-12\text{px}$ dots.
   - Ensure the halftone dots are crisp, unclipped, and visible on all 4 sides of the image.

## Progress & Tracking

- [x] Update `story-dots-rectangular.svg` with fully contained, distinct perimeter dots.
- [x] Update `halftone-density.css` with safe margin/clearance and remove clipping.
- [x] Verify visual appearance on `/about/` and `/impact/`.


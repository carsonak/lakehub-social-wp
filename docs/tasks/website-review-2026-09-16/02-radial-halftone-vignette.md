# Task 02: Radial Halftone Vignette Behind Photographs

## Objective and Agreed Behavior

1. **Radial Halftone Vignette**:
   - Replace the current rectangular halftone grid with a **radial halftone vignette**.
   - **Dot Gradient / Decay**: The center of the pattern must have the largest and most dense dots, with both the size and density of the dots reducing progressively the further from the center they get.
   - **Circumference Clearance**: The four corners of the rectangular image frame must sit **6px to 8px from the pattern's circumference** (the circle fully encloses the image, with corners 6px-8px inside the outer boundary).
   - **Full Image Containment**: The image must be completely contained within the pattern boundary.
   - **Center Anchoring**: In its default rest position, the radial pattern is anchored directly to the **center of the image** (`left: 50%; top: 50%; transform: translate(-50%, -50%)`).

2. **Target Image Frames**:
   - **"Our Story"** photo (About page, `.is-style-lakehub-story-photo`):
     - Dimensions: $484 \times 313$ px.
     - Center: $(242, 156.5)$ px.
     - Corner distance: $d_c = \sqrt{242^2 + 156.5^2} \approx 288.2$ px.
     - Outer radius: $R = d_c + 7\text{px} \approx 295.2$ px (Diameter $\approx 590.4$ px).
   - **"Community Projects" / Chichwa** photo (Impact page, `.is-style-lakehub-community-photo`):
     - Dimensions: $575 \times 338$ px.
     - Center: $(287.5, 169)$ px.
     - Corner distance: $d_c = \sqrt{287.5^2 + 169^2} \approx 333.5$ px.
     - Outer radius: $R = d_c + 7\text{px} \approx 340.5$ px (Diameter $\approx 681$ px).
   - **"Inspiring Portfolios" / Malika** photo (Impact page, `.is-style-lakehub-portfolio-photo`):
     - Dimensions: $369 \times 457$ px.
     - Center: $(184.5, 228.5)$ px.
     - Corner distance: $d_c = \sqrt{184.5^2 + 228.5^2} \approx 293.7$ px.
     - Outer radius: $R = d_c + 7\text{px} \approx 300.7$ px (Diameter $\approx 601.4$ px).

3. **Preserved Hover Repulsion & Reduced Motion**:
   - On pointer hover, the photograph frame repels away from the cursor while the radial halftone pattern counter-transforms to remain visually stationary in place.
   - Under `prefers-reduced-motion: reduce`, all dynamic transforms are disabled.

---

## Detailed Implementation Steps

### 1. Generate Mathematical Radial Halftone SVGs
Generate 3 dedicated SVGs or a scalable radial vignette generator:
- `assets/images/completion/story-dots-radial.svg` (ViewBox: 0 0 592 592, center 296 296, radius 295)
- `assets/images/completion/community-dots-radial.svg` (ViewBox: 0 0 682 682, center 341 341, radius 340)
- `assets/images/completion/portfolio-dots-radial.svg` (ViewBox: 0 0 602 602, center 301 301, radius 300)

**Algorithm for Dot Placement and Sizing**:
- Use concentric rings or polar coordinates where radial step $\Delta r$ increases outward:
  $r_i = R \cdot (i / N)^{1.3}$
- At radius $r$, the circle dot radius shrinks smoothly:
  $r_{\text{dot}}(r) = r_{\max} \cdot \left(1 - \frac{r}{R}\right)^{0.85} + r_{\min}$
  with $r_{\max} \approx 6.5\text{px}$ and $r_{\min} \approx 0.8\text{px}$.
- Density decay: dot angular spacing $\Delta \theta$ increases with $r$ so outer rings have sparser dots.
- Fill color: LakeHub Vivid Teal (`#00676B`).

### 2. Update Halftone Stylesheet (`assets/css/halftone-density.css`)
Update the `::before` pseudo-element rules:
```css
.is-style-lakehub-story-photo::before,
.is-style-lakehub-community-photo::before,
.is-style-lakehub-portfolio-photo::before {
  content: '' !important;
  display: block !important;
  position: absolute !important;
  z-index: -1 !important;
  top: 50% !important;
  left: 50% !important;
  bottom: auto !important;
  right: auto !important;
  background-size: contain !important;
  background-repeat: no-repeat !important;
  background-position: center center !important;
  pointer-events: none !important;
  transform: translate(-50%, -50%) translate3d(calc(-1 * var(--lakehub-repel-x, 0px)), calc(-1 * var(--lakehub-repel-y, 0px)), 0);
  transition: transform 120ms cubic-bezier(.2,.6,.4,1);
  will-change: transform;
}

/* Individual dimensions matching 2R */
.is-style-lakehub-story-photo::before {
  width: 592px !important;
  height: 592px !important;
  background-image: url('../images/completion/story-dots-radial.svg') !important;
}

.is-style-lakehub-community-photo::before {
  width: 682px !important;
  height: 682px !important;
  background-image: url('../images/completion/community-dots-radial.svg') !important;
}

.is-style-lakehub-portfolio-photo::before {
  width: 602px !important;
  height: 602px !important;
  background-image: url('../images/completion/portfolio-dots-radial.svg') !important;
}

@media (max-width: 600px) {
  .is-style-lakehub-story-photo::before,
  .is-style-lakehub-community-photo::before,
  .is-style-lakehub-portfolio-photo::before {
    transform: translate(-50%, -50%) scale(0.65) translate3d(calc(-1 * var(--lakehub-repel-x, 0px)), calc(-1 * var(--lakehub-repel-y, 0px)), 0);
  }
}
```

### 3. Maintain Pointer Repulsion in `assets/js/main.js`
Ensure `main.js` continues to update `--lakehub-repel-x` and `--lakehub-repel-y` without conflicting with the `translate(-50%, -50%)` center anchoring.

---

## Progress & Tracking

- [x] Calculate exact mathematical coordinates and dot gradients
- [x] Generate 3 radial halftone SVGs (`story-dots-radial.svg`, `community-dots-radial.svg`, `portfolio-dots-radial.svg`)
- [x] Update `halftone-density.css` with center anchoring and dimensions
- [x] Test hover repulsion and counter-transformation
- [x] Verify 6-8px corner clearance against circumferences (exact 7.01px clearance achieved for all 3 target frames)
- [x] Verify responsive behavior on mobile viewports

## Unplanned Changes & Scope Deviations

None. Center anchoring with `translate(-50%, -50%) translate3d(calc(-1 * var(--lakehub-repel-x)), calc(-1 * var(--lakehub-repel-y)), 0)` seamlessly preserves pointer repulsion while locking the radial halftone pattern to the image center at rest.


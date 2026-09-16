# Task 03: Home Hero Image Slideshow

## Objective and Agreed Behavior

1. **Hero Section 4-Image Endless Slideshow**:
   - The hero section of the Home page (`/`) will feature a smooth crossfade slideshow of **4 images**:
     1. `wp-content/uploads/2026/09/home-hero.jpg` (current home hero image)
     2. `wp-content/uploads/2026/09/home-hero-section-slide1.png` ($806 \times 535$ px)
     3. `wp-content/uploads/2026/09/home-hero-section-slide2.png` ($802 \times 535$ px)
     4. `wp-content/uploads/2026/09/home-hero-section-slide3.png` ($802 \times 535$ px)
   - **Continuous Endless Cycle**: The slides cycle endlessly in the exact same order (1 -> 2 -> 3 -> 4 -> 1 ...) once the page loads.
   - **Cycle Interval**: Exactly **3 seconds** (3000ms).
   - **No Controls & No Hover Pause**: There are no next/previous buttons, no indicator dots, and **no pause on hover**.
   - **Reduced Motion Behavior (`prefers-reduced-motion: reduce`)**:
     - The automatic 3-second cycle is disabled.
     - On every page reload, one of the 4 banner images is selected at **random** and displayed statically.

2. **Design & Contrast Parity**:
   - The hero retains the dark overlay (`#002021` at 50% opacity, min-height 538px) specified in `docs/design-exports/16-09-2026/Home.svg`.
   - The hero copy remains centered and crisp:
     - Headline: `Empowering the next generation of <mark class="has-vivid-teal-color">innovators</mark> in Africa.`
     - CTA buttons: `[ JOIN THE COMMUNITY ]` (solid vivid teal) and `[ OUR PROGRAMS ]` (white outline).

---

## Detailed Implementation Steps

### 1. Register/Import Media Attachments
Ensure `home-hero-section-slide1.png`, `home-hero-section-slide2.png`, and `home-hero-section-slide3.png` are properly registered in the WordPress database as media attachments alongside `home-hero.jpg`.

### 2. Pattern Markup (`patterns/home-hero.php`)
Structure the pattern with the 4 semantic slides:
```html
<section class="wp-block-cover alignfull is-style-lakehub-home-photo lakehub-hero-slideshow" id="community" style="min-height:538px">
  <div class="lakehub-hero-slides">
    <img class="lakehub-hero-slide is-active" src="/wp-content/uploads/2026/09/home-hero.jpg" alt="LakeHub community developers in workshop" />
    <img class="lakehub-hero-slide" src="/wp-content/uploads/2026/09/home-hero-section-slide1.png" alt="LakeHub developers collaborating" />
    <img class="lakehub-hero-slide" src="/wp-content/uploads/2026/09/home-hero-section-slide2.png" alt="LakeHub cohort members collaborating on software" />
    <img class="lakehub-hero-slide" src="/wp-content/uploads/2026/09/home-hero-section-slide3.png" alt="LakeHub training space in Kisumu" />
  </div>
  <span aria-hidden="true" class="wp-block-cover__background has-footer-background-color has-background-dim-60 has-background-dim"></span>
  <div class="wp-block-cover__inner-container">
    <div class="wp-block-group is-style-lakehub-photo-hero-copy">
      <h1 class="wp-block-heading">Empowering the<br>next generation of<br><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-vivid-teal-color">innovators</mark> in Africa.</h1>
      <div class="wp-block-buttons">
        <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/#community">JOIN THE COMMUNITY</a></div>
        <div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/programs/">OUR PROGRAMS</a></div>
      </div>
    </div>
  </div>
</section>
```

### 3. Styling (`style.css`)
```css
.lakehub-hero-slideshow {
  position: relative;
  overflow: hidden;
}

.lakehub-hero-slides {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.lakehub-hero-slide {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 800ms ease-in-out;
  pointer-events: none;
}

.lakehub-hero-slide.is-active {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .lakehub-hero-slide {
    transition: none !important;
  }
}
```

### 4. Controller Script (`assets/js/main.js`)
```javascript
const heroSlides = Array.from(document.querySelectorAll('.lakehub-hero-slide'));
if (heroSlides.length > 1) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Randomize static slide on every reload
    const randomIndex = Math.floor(Math.random() * heroSlides.length);
    heroSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === randomIndex));
  } else {
    let current = 0;
    setInterval(() => {
      heroSlides[current].classList.remove('is-active');
      current = (current + 1) % heroSlides.length;
      heroSlides[current].classList.add('is-active');
    }, 3000);
  }
}
```

### 5. Content Synchronization
Update the Home page (ID 11) in the SQLite database to incorporate the 4-slide slideshow markup.

---

## Progress & Tracking

- [x] Verify image paths in `wp-content/uploads/2026/09/` (`home-hero.jpg`, `home-hero-section-slide1.png`, `slide2.png`, `slide3.png`)
- [x] Add 4-slide structure to `patterns/home-hero.php` and `render_block_core/cover` filter in `functions.php`
- [x] Implement transitions and styles in `style.css` (800ms crossfade, position absolute, opacity toggle)
- [x] Implement 3s continuous loop and reduced-motion randomizer in `assets/js/main.js`
- [x] Import media attachments into WordPress database (IDs 211, 212, 213)
- [x] Test 3s cycle and reduced-motion random reload (automated Playwright test passed)

## Unplanned Changes & Scope Deviations

Implemented the 4-slide markup via `render_block_core/cover` filter in `functions.php` in addition to `patterns/home-hero.php`. This delivers SSR performance and zero layout shift while preserving 100% native block validation for editors in the Site Editor.


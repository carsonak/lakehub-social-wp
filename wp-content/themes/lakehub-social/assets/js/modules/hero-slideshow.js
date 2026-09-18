/**
 * Home hero 4-image slideshow controller.
 *
 * @package LakeHub_Social
 */

(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const heroSlides = Array.from(document.querySelectorAll('.lakehub-hero-slide'));

  if (heroSlides.length <= 1) return;

  let slideshowInterval = null;

  const startSlideshow = () => {
    if (slideshowInterval) clearInterval(slideshowInterval);
    let current = heroSlides.findIndex((slide) => slide.classList.contains('is-active'));
    if (current === -1) {
      current = 0;
      heroSlides[0].classList.add('is-active');
    }
    slideshowInterval = setInterval(() => {
      heroSlides[current].classList.remove('is-active');
      current = (current + 1) % heroSlides.length;
      heroSlides[current].classList.add('is-active');
    }, 3000);
  };

  const randomizeStaticSlide = () => {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
    const randomIndex = Math.floor(Math.random() * heroSlides.length);
    heroSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === randomIndex));
  };

  if (reducedMotion.matches) {
    randomizeStaticSlide();
  } else {
    startSlideshow();
  }

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      randomizeStaticSlide();
    } else {
      startSlideshow();
    }
  });
})();

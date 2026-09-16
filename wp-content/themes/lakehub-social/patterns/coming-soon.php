<?php
/**
 * Title: Coming Soon
 * Slug: lakehub-social/coming-soon
 * Categories: lakehub
 * Description: Clean announcement banner for pending initiatives and links.
 */
?>
<!-- wp:group {"tagName":"section","align":"full","className":"lakehub-coming-soon-section","layout":{"type":"default"}} -->
<section class="wp-block-group alignfull lakehub-coming-soon-section">
  <div class="lakehub-coming-soon-card">
    <span class="lakehub-coming-soon-pill">COMING SOON</span>
    <h1 class="lakehub-coming-soon-title">Exciting Things Are On The Way</h1>
    <p class="lakehub-coming-soon-desc">We are preparing this initiative to expand opportunities, resources, and connections across the LakeHub ecosystem. Check back soon for updates or explore our active programs and community stories.</p>
    <div class="wp-block-buttons lakehub-coming-soon-buttons">
      <div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/' ) ); ?>">BACK TO HOME</a></div>
      <div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url( '/programs/' ) ); ?>">EXPLORE PROGRAMS</a></div>
    </div>
  </div>
</section>
<!-- /wp:group -->

<?php
/**
 * Title: LakeHub Footer
 * Slug: lakehub-social/site-footer
 * Categories: lakehub
 * Description: Editable Figma-based LakeHub layout.
 * Inserter: no
 */
?>
<!-- wp:group {"align":"full","className":"is-style-lakehub-footer","backgroundColor":"footer","textColor":"white","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull is-style-lakehub-footer has-white-color has-footer-background-color has-text-color has-background"><!-- wp:group {"className":"is-style-lakehub-footer-grid","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-footer-grid"><!-- wp:group {"className":"is-style-lakehub-footer-brand","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-footer-brand"><!-- wp:image {"sizeSlug":"full","linkDestination":"custom","className":"is-style-lakehub-footer-logo"} -->
<figure class="wp-block-image size-full is-style-lakehub-footer-logo"><a href="<?php echo esc_url( home_url() ); ?>/"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/logo-footer.png' ) ); ?>" alt="LakeHub — home"/></a></figure>
<!-- /wp:image -->

<!-- wp:group {"style":{"spacing":{"blockGap":"var:preset|spacing|small"}},"layout":{"type":"flex"}} -->
<div class="wp-block-group"><!-- wp:image {"sizeSlug":"full","linkDestination":"custom","className":"is-style-lakehub-social-icon"} -->
<figure class="wp-block-image size-full is-style-lakehub-social-icon"><a href="https://www.linkedin.com/company/lakehub/" target="_blank" rel="noopener noreferrer"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/linkedin.svg' ) ); ?>" alt="LinkedIn"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","className":"is-style-lakehub-social-icon"} -->
<figure class="wp-block-image size-full is-style-lakehub-social-icon"><a href="https://www.facebook.com/LakeHubKisumu/" target="_blank" rel="noopener noreferrer"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/facebook.svg' ) ); ?>" alt="Facebook"/></a></figure>
<!-- /wp:image -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"custom","className":"is-style-lakehub-social-icon"} -->
<figure class="wp-block-image size-full is-style-lakehub-social-icon"><a href="https://x.com/lakehub" target="_blank" rel="noopener noreferrer"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/x.svg' ) ); ?>" alt="X"/></a></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"is-style-lakehub-footer-links","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-footer-links"><!-- wp:heading {"fontSize":"lead"} -->
<h2 class="wp-block-heading has-lead-font-size">Quick Links</h2>
<!-- /wp:heading -->

<!-- wp:navigation <?php echo lakehub_social_navigation_attributes( 'footer', json_decode( '{"overlayMenu":"never","ariaLabel":"Quick Links","layout":{"type":"flex","orientation":"vertical"}}', true ) ); ?> -->
<!-- wp:navigation-link {"label":"About Us","kind":"custom","url":"<?php echo esc_url( home_url() ); ?>/about/"} /-->
<!-- wp:navigation-link {"label":"Our Mission","kind":"custom","url":"<?php echo esc_url( home_url() ); ?>/about/#mission"} /-->
<!-- wp:navigation-link {"label":"Impact Stories","kind":"custom","url":"<?php echo esc_url( home_url() ); ?>/impact/"} /-->
<!-- wp:navigation-link {"label":"History","kind":"custom","url":"<?php echo esc_url( home_url() ); ?>/about/#history"} /-->
<!-- /wp:navigation --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"is-style-lakehub-footer-links","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-footer-links"><!-- wp:heading {"fontSize":"lead"} -->
<h2 class="wp-block-heading has-lead-font-size">Help</h2>
<!-- /wp:heading -->

<!-- wp:navigation <?php echo lakehub_social_navigation_attributes( 'footer_help', json_decode( '{"overlayMenu":"never","ariaLabel":"Help","layout":{"type":"flex","orientation":"vertical"}}', true ) ); ?> -->
<!-- wp:navigation-link {"label":"FAQ","kind":"custom","url":"<?php echo esc_url( home_url() ); ?>/coming-soon/"} /-->
<!-- wp:navigation-link {"label":"Support","kind":"custom","url":"<?php echo esc_url( home_url() ); ?>/coming-soon/"} /-->
<!-- /wp:navigation --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"is-style-lakehub-footer-links","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-footer-links"><!-- wp:paragraph -->
<p>Get in touch!</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">Subscribe to our news letter</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<form class="is-style-lakehub-newsletter" action="#" method="post">
  <input type="email" class="lakehub-newsletter-input" placeholder="example@gmail.com" aria-label="Your email address" required />
  <button type="submit" class="is-style-lakehub-newsletter-label">Subscribe</button>
</form>
<!-- /wp:html --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"is-style-lakehub-footer-bottom","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-footer-bottom"><!-- wp:paragraph -->
<p>© 2024 LakeHub Foundation. All rights reserved.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><a href="<?php echo esc_url( home_url() ); ?>/coming-soon/">Privacy Policy</a>　 <a href="mailto:info@lakehub.co.ke">Contact Us</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<?php
/**
 * Title: Home · Hero
 * Slug: lakehub-social/home-hero
 * Categories: lakehub
 * Description: Editable Figma-based LakeHub layout.
 */
?>
<!-- wp:group {"tagName":"section","templateLock":"contentOnly","metadata":{"name":"Home · Hero"},"align":"full","className":"is-style-lakehub-hero","gradient":"hero","layout":{"type":"default"},"anchor":"community"} -->
<section class="wp-block-group alignfull is-style-lakehub-hero has-hero-gradient-background has-background" id="community"><!-- wp:group {"className":"is-style-lakehub-hero-grid","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-hero-grid"><!-- wp:group {"className":"is-style-lakehub-hero-copy","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-hero-copy"><!-- wp:heading {"level":1,"fontSize":"display"} -->
<h1 class="wp-block-heading has-display-font-size">Empowering the<br>next generation of<br><mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-teal-color">innovators</mark> in Africa.</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"body","fontSize":"lead"} -->
<p class="has-body-color has-text-color has-lead-font-size">We are a growing community bridging the gap between talent and opportunity through technology, creativity, and social investment.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"style":{"spacing":{"blockGap":"var:preset|spacing|small"}},"layout":{"type":"flex","flexWrap":"wrap"}} -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url() ); ?>/#community">JOIN THE COMMUNITY</a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-outline"} -->
<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="<?php echo esc_url( home_url() ); ?>/programs/">OUR PROGRAMS</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->

<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"is-style-lakehub-hero-image"} -->
<figure class="wp-block-image size-full is-style-lakehub-hero-image"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home-hero.png' ) ); ?>" alt="The LakeHub community gathered outside the innovation hub."/></figure>
<!-- /wp:image --></div>
<!-- /wp:group --></section>
<!-- /wp:group -->

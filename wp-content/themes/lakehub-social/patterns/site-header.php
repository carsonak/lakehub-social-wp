<?php
/**
 * Title: LakeHub Header
 * Slug: lakehub-social/site-header
 * Categories: lakehub
 * Description: Editable Figma-based LakeHub layout.
 * Inserter: no
 */
?>
<!-- wp:group {"align":"full","className":"is-style-lakehub-header","layout":{"type":"default"}} -->
<div class="wp-block-group alignfull is-style-lakehub-header"><!-- wp:group {"className":"is-style-lakehub-header-row","layout":{"type":"default"}} -->
<div class="wp-block-group is-style-lakehub-header-row"><!-- wp:image {"sizeSlug":"full","linkDestination":"custom","className":"is-style-lakehub-header-logo"} -->
<figure class="wp-block-image size-full is-style-lakehub-header-logo"><a href="<?php echo esc_url( home_url() ); ?>/"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/logo-header.png' ) ); ?>" alt="LakeHub — home"/></a></figure>
<!-- /wp:image -->

<!-- wp:navigation <?php echo lakehub_social_navigation_attributes( 'primary', json_decode( '{"layout":{"type":"flex","justifyContent":"right"},"ariaLabel":"Primary navigation"}', true ) ); ?> -->
<!-- wp:navigation-link {"label":"Home","url":"<?php echo esc_url( home_url() ); ?>/","kind":"custom"} /-->

<!-- wp:navigation-link {"label":"About","url":"<?php echo esc_url( home_url() ); ?>/#about","kind":"custom"} /-->

<!-- wp:navigation-link {"label":"Programs","url":"<?php echo esc_url( home_url() ); ?>/programs/","kind":"custom"} /-->

<!-- wp:navigation-link {"label":"Impact","url":"<?php echo esc_url( home_url() ); ?>/#impact","kind":"custom"} /-->
<!-- /wp:navigation --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

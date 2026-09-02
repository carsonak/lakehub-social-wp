<?php
/** Site header. @package LakeHub_Social */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?><!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#main-content"><?php esc_html_e( 'Skip to content', 'lakehub-social' ); ?></a>
<header class="site-header"><div class="container header-inner">
	<div class="brand">
		<?php if ( has_custom_logo() ) : the_custom_logo(); else : ?>
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>"><?php echo lakehub_social_image( 0, 'figma-b858.png', get_bloginfo( 'name' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></a>
		<?php endif; ?>
	</div>
	<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="<?php esc_attr_e( 'Toggle navigation', 'lakehub-social' ); ?>"><span></span><span></span><span></span></button>
	<nav class="site-nav" id="primary-navigation" aria-label="<?php esc_attr_e( 'Primary navigation', 'lakehub-social' ); ?>">
		<?php wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false, 'items_wrap' => '<ul class="menu">%3$s</ul>', 'fallback_cb' => 'lakehub_social_primary_menu_fallback', 'depth' => 1 ) ); ?>
	</nav>
</div></header>
<?php

/** Render primary links until an editor assigns a menu. */
function lakehub_social_primary_menu_fallback() {
	foreach ( array( '#home' => 'Home', '#about' => 'About', '#programs' => 'Programs', '#impact' => 'Impact' ) as $url => $label ) {
		echo '<a href="' . esc_url( $url ) . '">' . esc_html( $label ) . '</a>';
	}
}

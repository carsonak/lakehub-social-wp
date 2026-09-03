<?php
/** Site header. @package LakeHub_Social */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#main-content"><?php esc_html_e( 'Skip to content', 'lakehub-social' ); ?></a>
<header class="site-header">
	<div class="header-inner">
		<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
			<?php echo lakehub_social_image( 0, 'logo-header.png', get_bloginfo( 'name' ), array( 'width' => 186, 'height' => 55 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</a>
		<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="<?php esc_attr_e( 'Toggle navigation', 'lakehub-social' ); ?>"><span></span><span></span><span></span></button>
		<nav class="site-nav" id="primary-navigation" aria-label="<?php esc_attr_e( 'Primary navigation', 'lakehub-social' ); ?>">
			<?php wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false, 'items_wrap' => '<ul class="menu">%3$s</ul>', 'fallback_cb' => 'lakehub_social_primary_menu_fallback', 'depth' => 1 ) ); ?>
		</nav>
	</div>
</header>
<?php

/** Render the designed primary links until an editor assigns a menu. */
function lakehub_social_primary_menu_fallback() {
	$links = array(
		home_url( '/' )          => __( 'Home', 'lakehub-social' ),
		home_url( '/#about' )    => __( 'About', 'lakehub-social' ),
		home_url( '/programs/' ) => __( 'Programs', 'lakehub-social' ),
		home_url( '/#impact' )   => __( 'Impact', 'lakehub-social' ),
	);
	echo '<ul class="menu">';
	foreach ( $links as $url => $label ) {
		$current = ( is_front_page() && home_url( '/' ) === $url ) || ( is_page_template( 'page-programs.php' ) && home_url( '/programs/' ) === $url );
		echo '<li' . ( $current ? ' class="current-menu-item"' : '' ) . '><a href="' . esc_url( $url ) . '">' . esc_html( $label ) . '</a></li>';
	}
	echo '</ul>';
}

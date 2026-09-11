<?php
/** LakeHub block theme. @package LakeHub_Social */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'after_setup_theme', static function () {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'post-thumbnails' );
	add_editor_style( 'style.css' );
} );

add_action( 'wp_enqueue_scripts', static function () {
	wp_enqueue_style( 'lakehub-social', get_stylesheet_uri(), array(), filemtime( get_theme_file_path( 'style.css' ) ) );
	wp_enqueue_script( 'lakehub-social', get_theme_file_uri( 'assets/js/main.js' ), array(), filemtime( get_theme_file_path( 'assets/js/main.js' ) ), true );
} );

add_action( 'init', static function () {
	register_block_pattern_category( 'lakehub', array( 'label' => __( 'LakeHub sections', 'lakehub-social' ) ) );
	$styles = array(
		'core/group' => array( 'hero', 'hero-grid', 'hero-copy', 'impact', 'impact-heading', 'impact-grid', 'impact-feature', 'impact-wide', 'journey', 'timeline', 'milestone', 'partners', 'partner-logos', 'insights', 'insight-card', 'insight-copy', 'cta', 'header', 'header-row', 'footer', 'footer-grid', 'footer-brand', 'footer-links', 'footer-bottom', 'newsletter', 'flagship-heading', 'benefits', 'benefit', 'program-section', 'page-shell', 'photo-hero-copy', 'impact-stats', 'metrics', 'metric-row', 'metric-photo', 'metric-copy', 'flagship-centred', 'zone-brand', 'about-page', 'about-intro', 'about-mission', 'mission-card', 'mission-copy', 'mission-collage', 'about-story', 'story-grid', 'about-team', 'impact-page', 'impact-community', 'community-grid', 'community-copy', 'impact-portfolio', 'portfolio-grid', 'portfolio-copy', 'impact-transformation', 'transformation-grid', 'transformation-card', 'team-page' ),
		'core/cover' => array( 'flagship', 'home-photo', 'programs-photo', 'about-hero', 'impact-hero' ),
		'core/image' => array( 'hero-image', 'impact-photo', 'partner-logo', 'benefit-icon', 'header-logo', 'footer-logo', 'social-icon', 'zone-mark', 'mission-main', 'mission-speaker', 'mission-group', 'mission-event', 'story-photo', 'community-photo', 'portfolio-photo' ),
		'core/button' => array( 'text-link', 'optional-action' ),
		'core/paragraph' => array( 'year', 'newsletter-label', 'zone-word' ),
		'core/query' => array( 'insights' ),
	);
	foreach ( $styles as $block => $names ) {
		foreach ( $names as $name ) {
			register_block_style( $block, array( 'name' => 'lakehub-' . $name, 'label' => 'LakeHub ' . ucwords( str_replace( '-', ' ', $name ) ) ) );
		}
	}
} );

// Header/footer sources stay in Git; patterns resolve local asset URLs when registered.
add_filter( 'should_load_remote_block_patterns', '__return_false' );

/** Native menu references imported from the classic theme, when present. */
function lakehub_social_navigation_attributes( $location, $attributes ) {
	$references = get_option( 'lakehub_block_navigation', array() );
	if ( ! empty( $references[ $location ] ) ) { $attributes['ref'] = (int) $references[ $location ]; }
	return wp_json_encode( $attributes );
}

// Custom URL links also need the Figma active-page indicator and accessible current state.
add_filter( 'render_block_core/navigation-link', static function ( $html, $block ) {
	$url = $block['attrs']['url'] ?? '';
	$current = is_front_page() ? home_url( '/' ) : ( is_singular() ? get_permalink() : '' );
	if ( $current && $url && untrailingslashit( $url ) === untrailingslashit( $current ) ) {
		$tags = new WP_HTML_Tag_Processor( $html );
		if ( $tags->next_tag( 'LI' ) ) { $tags->add_class( 'current-menu-item' ); }
		if ( $tags->next_tag( 'A' ) ) { $tags->set_attribute( 'aria-current', 'page' ); }
		return $tags->get_updated_html();
	}
	return $html;
}, 10, 2 );

add_filter( 'block_editor_settings_all', static function ( $settings ) {
	$settings['codeEditingEnabled'] = current_user_can( 'manage_options' );
	$settings['canLockBlocks'] = current_user_can( 'manage_options' );
	return $settings;
} );

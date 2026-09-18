<?php
/**
 * Style and script enqueuing and theme supports for the LakeHub Social theme.
 *
 * @package LakeHub_Social
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Enable native modular loading of core block stylesheets on demand.
add_filter( 'should_load_separate_core_block_assets', '__return_true' );

add_action( 'after_setup_theme', static function () {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'post-thumbnails' );

	$editor_styles = array( 'style.css' );

	$modular_css = array(
		'assets/css/navigation-header.css',
		'assets/css/footer.css',
		'assets/css/sections.css',
		'assets/css/partners.css',
		'assets/css/insights.css',
		'assets/css/single-post.css',
		'assets/css/coming-soon.css',
		'assets/css/halftone-density.css',
	);

	foreach ( $modular_css as $css_file ) {
		if ( file_exists( get_theme_file_path( $css_file ) ) ) {
			$editor_styles[] = $css_file;
		}
	}

	add_editor_style( $editor_styles );
} );

add_action( 'wp_enqueue_scripts', static function () {
	$style_path = get_theme_file_path( 'style.css' );
	wp_enqueue_style( 'lakehub-social', get_stylesheet_uri(), array(), filemtime( $style_path ) );

	// Enqueue modular stylesheets when present.
	$modular_stylesheets = array(
		'lakehub-navigation' => 'assets/css/navigation-header.css',
		'lakehub-footer'     => 'assets/css/footer.css',
		'lakehub-sections'   => 'assets/css/sections.css',
		'lakehub-partners'   => 'assets/css/partners.css',
		'lakehub-insights'   => 'assets/css/insights.css',
	);

	foreach ( $modular_stylesheets as $handle => $relative_path ) {
		$full_path = get_theme_file_path( $relative_path );
		if ( file_exists( $full_path ) ) {
			wp_enqueue_style( $handle, get_theme_file_uri( $relative_path ), array( 'lakehub-social' ), filemtime( $full_path ) );
		}
	}

	// Single post template styling.
	if ( is_single() ) {
		$single_css = get_theme_file_path( 'assets/css/single-post.css' );
		if ( file_exists( $single_css ) ) {
			wp_enqueue_style( 'lakehub-single-post', get_theme_file_uri( 'assets/css/single-post.css' ), array( 'lakehub-social' ), filemtime( $single_css ) );
		}
	}

	// Halftone density styling.
	$density_path = get_theme_file_path( 'assets/css/halftone-density.css' );
	if ( file_exists( $density_path ) ) {
		wp_enqueue_style( 'lakehub-social-halftone-density', get_theme_file_uri( 'assets/css/halftone-density.css' ), array( 'lakehub-social' ), filemtime( $density_path ) );
	}

	// Main global scripts.
	$main_js_path = get_theme_file_path( 'assets/js/main.js' );
	wp_enqueue_script( 'lakehub-social', get_theme_file_uri( 'assets/js/main.js' ), array(), filemtime( $main_js_path ), true );

	// Modular JavaScript files when present.
	$modular_scripts = array(
		'lakehub-partner-carousel'  => 'assets/js/modules/partner-carousel.js',
		'lakehub-program-cards'     => 'assets/js/modules/program-cards.js',
		'lakehub-hero-slideshow'    => 'assets/js/modules/hero-slideshow.js',
		'lakehub-insights-carousel' => 'assets/js/modules/insights-carousel.js',
		'lakehub-collapsible'       => 'assets/js/modules/collapsible.js',
		'lakehub-metrics'           => 'assets/js/modules/metrics.js',
		'lakehub-halftone-hover'    => 'assets/js/modules/halftone-hover.js',
	);

	foreach ( $modular_scripts as $handle => $relative_path ) {
		$full_path = get_theme_file_path( $relative_path );
		if ( file_exists( $full_path ) ) {
			wp_enqueue_script( $handle, get_theme_file_uri( $relative_path ), array( 'lakehub-social' ), filemtime( $full_path ), true );
		}
	}

	// Social share script on single posts.
	if ( is_single() ) {
		$share_js = get_theme_file_path( 'assets/js/modules/social-share.js' );
		if ( file_exists( $share_js ) ) {
			wp_enqueue_script( 'lakehub-social-share', get_theme_file_uri( 'assets/js/modules/social-share.js' ), array( 'lakehub-social' ), filemtime( $share_js ), true );
		}
	}

	// Halftone canvas generator.
	$generator_path = get_theme_file_path( 'assets/js/halftone-generator.js' );
	if ( file_exists( $generator_path ) ) {
		wp_enqueue_script( 'lakehub-halftone-generator', get_theme_file_uri( 'assets/js/halftone-generator.js' ), array( 'lakehub-social' ), filemtime( $generator_path ), true );
	}
} );

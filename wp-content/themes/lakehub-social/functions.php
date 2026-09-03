<?php
/**
 * LakeHub Social theme setup.
 *
 * @package LakeHub_Social
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function lakehub_social_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 120,
			'width'       => 360,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );

	register_nav_menus(
		array(
			'primary'     => __( 'Primary navigation', 'lakehub-social' ),
			'footer'      => __( 'Footer quick links', 'lakehub-social' ),
			'footer_help' => __( 'Footer help links', 'lakehub-social' ),
		)
	);
}
add_action( 'after_setup_theme', 'lakehub_social_setup' );

function lakehub_social_assets() {
	$version = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'lakehub-social', get_stylesheet_uri(), array(), $version );
	wp_enqueue_script( 'lakehub-social', get_theme_file_uri( 'assets/js/main.js' ), array(), $version, true );
}
add_action( 'wp_enqueue_scripts', 'lakehub_social_assets' );

function lakehub_social_resource_hints( $urls, $relation_type ) {
	if ( 'preload' === $relation_type ) {
		foreach ( array( 'hanken-grotesk.woff2', 'montserrat.woff2', 'jetbrains-mono.woff2', 'inter.woff2' ) as $font ) {
			$urls[] = array(
				'href'        => get_theme_file_uri( 'assets/fonts/' . $font ),
				'as'          => 'font',
				'crossorigin' => 'anonymous',
			);
		}
	}
	return $urls;
}
add_filter( 'wp_resource_hints', 'lakehub_social_resource_hints', 10, 2 );

require_once get_theme_file_path( 'inc/homepage-content.php' );
require_once get_theme_file_path( 'inc/homepage-admin.php' );
require_once get_theme_file_path( 'inc/programs.php' );

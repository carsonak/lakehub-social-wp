<?php
/**
 * Block style registrations for the LakeHub Social theme.
 *
 * @package LakeHub_Social
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', static function () {
	register_block_pattern_category( 'lakehub', array( 'label' => __( 'LakeHub sections', 'lakehub-social' ) ) );

	$styles = array(
		'core/group' => array(
			'hero', 'hero-grid', 'hero-copy', 'impact', 'impact-heading', 'impact-grid',
			'impact-feature', 'impact-wide', 'journey', 'timeline', 'milestone', 'partners',
			'partner-logos', 'insights', 'insight-card', 'insight-copy', 'cta', 'header',
			'header-row', 'footer', 'footer-grid', 'footer-brand', 'footer-links', 'footer-bottom',
			'newsletter', 'flagship-heading', 'benefits', 'benefit', 'program-section', 'page-shell',
			'photo-hero-copy', 'impact-stats', 'metrics', 'metric-row', 'metric-photo', 'metric-copy',
			'flagship-centred', 'zone-brand', 'about-page', 'about-intro', 'about-mission',
			'mission-card', 'mission-copy', 'mission-collage', 'about-story', 'story-grid',
			'about-team', 'impact-page', 'impact-community', 'community-grid', 'community-copy',
			'impact-portfolio', 'portfolio-grid', 'portfolio-copy', 'impact-transformation',
			'transformation-grid', 'transformation-card', 'team-page',
		),
		'core/cover' => array(
			'flagship', 'home-photo', 'programs-photo', 'about-hero', 'impact-hero',
		),
		'core/image' => array(
			'hero-image', 'impact-photo', 'partner-logo', 'benefit-icon', 'header-logo',
			'footer-logo', 'social-icon', 'zone-mark', 'mission-main', 'mission-speaker',
			'mission-group', 'mission-event', 'story-photo', 'community-photo', 'portfolio-photo',
		),
		'core/button' => array(
			'text-link', 'optional-action',
		),
		'core/paragraph' => array(
			'year', 'newsletter-label', 'zone-word',
		),
		'core/query' => array(
			'insights',
		),
	);

	foreach ( $styles as $block => $names ) {
		foreach ( $names as $name ) {
			register_block_style(
				$block,
				array(
					'name'  => 'lakehub-' . $name,
					'label' => 'LakeHub ' . ucwords( str_replace( '-', ' ', $name ) ),
				)
			);
		}
	}
} );

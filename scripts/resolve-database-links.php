<?php
/**
 * Update database posts with resolved links.
 */

require_once __DIR__ . '/../wp-load.php';

// Post 11: Home
$home = get_post( 11 );
if ( $home ) {
	$content = $home->post_content;
	$content = str_replace( 'href="/#community"', 'href="/coming-soon/"', $content );
	wp_update_post( array(
		'ID'           => 11,
		'post_content' => $content,
	) );
	echo "Updated Post 11 (Home) links.\n";
}

// Post 21: Programs
$programs = get_post( 21 );
if ( $programs ) {
	$content = $programs->post_content;
	$content = str_replace(
		'<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">View Program</a></div>',
		'<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="https://www.zone01kisumu.ke/" target="_blank" rel="noopener noreferrer">View Program</a></div>',
		$content
	);
	wp_update_post( array(
		'ID'           => 21,
		'post_content' => $content,
	) );
	echo "Updated Post 21 (Programs) links.\n";
}

// Post 150: Impact
$impact = get_post( 150 );
if ( $impact ) {
	$content = $impact->post_content;
	$content = str_replace(
		'<div class="wp-block-button is-style-lakehub-optional-action"><a class="wp-block-button__link wp-element-button">Read more →</a></div>',
		'<div class="wp-block-button is-style-lakehub-optional-action"><a class="wp-block-button__link wp-element-button" href="/coming-soon/">Read more →</a></div>',
		$content
	);
	$content = str_replace(
		'<div class="wp-block-button is-style-lakehub-optional-action"><a class="wp-block-button__link wp-element-button">View More People</a></div>',
		'<div class="wp-block-button is-style-lakehub-optional-action"><a class="wp-block-button__link wp-element-button" href="/team/">View More People</a></div>',
		$content
	);
	$content = str_replace(
		'href="https://www.zone01kisumu.ke/">Read more</a>',
		'href="/from-kisumu-to-global-opportunities/">Read more</a>',
		$content
	);
	wp_update_post( array(
		'ID'           => 150,
		'post_content' => $content,
	) );
	echo "Updated Post 150 (Impact) links.\n";
}

echo "Database link resolution complete.\n";

<?php
/**
 * Update Home page (post 11) copy to align with Google Doc source
 */

require_once __DIR__ . '/../wp-load.php';

$post = get_post( 11 );
if ( ! $post ) {
	echo "Post 11 not found\n";
	exit( 1 );
}

$old_text = '<p class="has-body-color has-text-color has-lead-font-size">Stories of innovation and community progress.</p>';
$new_text = '<p class="has-body-color has-text-color has-lead-font-size">Ideas, people and innovations shaping the future from Kisumu and beyond.</p>';

if ( strpos( $post->post_content, $old_text ) !== false ) {
	$content = str_replace( $old_text, $new_text, $post->post_content );
	wp_update_post( array(
		'ID'           => 11,
		'post_content' => $content,
	) );
	echo "Successfully updated Post 11 (Home) Insights subheading.\n";
} else {
	echo "Insights subheading already up-to-date or old text not found in Post 11.\n";
}

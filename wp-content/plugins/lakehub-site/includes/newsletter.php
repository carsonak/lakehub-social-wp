<?php
/**
 * LakeHub Newsletter integration with Mailchimp for WordPress (MC4WP).
 *
 * @package LakeHub_Site
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Ensures the canonical LakeHub Mailchimp newsletter form exists and is configured.
 *
 * @param bool $force_update Whether to overwrite settings on existing form.
 * @return int Form post ID.
 */
function lakehub_ensure_newsletter_form( $force_update = false ) {
	$list_id = '150232a912'; // LakeHub Social Mailchimp audience list.

	$existing = get_posts( [
		'post_type'   => 'mc4wp-form',
		'post_status' => 'any',
		'numberposts' => 1,
	] );

	$form_content = '<div class="is-style-lakehub-newsletter">' . "\n"
		. '  <input type="email" name="EMAIL" class="lakehub-newsletter-input" placeholder="example@gmail.com" aria-label="Your email address" required />' . "\n"
		. '  <button type="submit" class="is-style-lakehub-newsletter-label">Subscribe</button>' . "\n"
		. '</div>';

	$settings = [
		'css'                    => 0,
		'double_optin'           => 1,
		'hide_after_success'     => 0,
		'lists'                  => [ $list_id ],
		'redirect'               => '',
		'replace_interests'      => 1,
		'required_fields'        => '',
		'update_existing'        => 1,
		'subscriber_tags'        => 'website, newsletter',
		'remove_subscriber_tags' => '',
		'email_typo_check'       => 0,
	];

	$messages = [
		'subscribed'             => __( 'Thank you for subscribing! Please check your email to confirm your subscription.', 'lakehub-site' ),
		'updated'                => __( 'Thank you, your subscription preferences have been updated.', 'lakehub-site' ),
		'error'                  => __( 'Oops! An error occurred while processing your request. Please try again.', 'lakehub-site' ),
		'invalid_email'          => __( 'Please provide a valid email address.', 'lakehub-site' ),
		'already_subscribed'     => __( 'You are already subscribed to the LakeHub newsletter!', 'lakehub-site' ),
		'required_field_missing' => __( 'Please fill in all required fields.', 'lakehub-site' ),
		'no_lists_selected'      => __( 'Please select at least one list.', 'lakehub-site' ),
	];

	if ( empty( $existing ) ) {
		$form_id = wp_insert_post( [
			'post_title'   => 'LakeHub Newsletter',
			'post_content' => $form_content,
			'post_status'  => 'publish',
			'post_type'    => 'mc4wp-form',
		] );

		if ( ! is_wp_error( $form_id ) && $form_id ) {
			update_post_meta( $form_id, '_mc4wp_settings', $settings );
			update_post_meta( $form_id, '_mc4wp_messages', $messages );
		}

		return (int) $form_id;
	}

	$form_id = $existing[0]->ID;

	if ( $force_update ) {
		wp_update_post( [
			'ID'           => $form_id,
			'post_content' => $form_content,
			'post_status'  => 'publish',
		] );
		update_post_meta( $form_id, '_mc4wp_settings', $settings );
		update_post_meta( $form_id, '_mc4wp_messages', $messages );
	}

	return (int) $form_id;
}

// Ensure form exists when MC4WP post type is active
add_action( 'init', function() {
	if ( ! post_type_exists( 'mc4wp-form' ) ) {
		return;
	}

	$existing = get_posts( [
		'post_type'   => 'mc4wp-form',
		'post_status' => 'publish',
		'numberposts' => 1,
		'fields'      => 'ids',
	] );

	if ( empty( $existing ) ) {
		lakehub_ensure_newsletter_form();
	}
}, 20 );

// Register WP-CLI command
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command( 'lakehub newsletter setup', function( $args, $assoc_args ) {
		$form_id = lakehub_ensure_newsletter_form( true );
		WP_CLI::success( sprintf( 'LakeHub newsletter form setup complete (Form ID: %d).', $form_id ) );
	} );
}

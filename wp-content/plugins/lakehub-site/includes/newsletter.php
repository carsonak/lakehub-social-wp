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

	WP_CLI::add_command( 'lakehub newsletter test-email', function( $args, $assoc_args ) {
		if ( empty( $args[0] ) ) {
			WP_CLI::error( 'Please specify an email: wp lakehub newsletter test-email <email>' );
		}
		$email  = sanitize_email( $args[0] );
		$result = lakehub_send_newsletter_confirmation( $email );
		if ( $result ) {
			WP_CLI::success( sprintf( 'Confirmation email dispatched to %s.', $email ) );
		} else {
			WP_CLI::warning( sprintf( 'wp_mail returned false for %s (local MTA may be unconfigured). Verification transient recorded.', $email ) );
		}
	} );
}

/**
 * Sends a branded LakeHub HTML confirmation email upon newsletter subscription.
 *
 * @param string $email Recipient email address.
 * @param array  $data  Submitted form fields.
 * @return bool Whether wp_mail dispatched the email.
 */
function lakehub_send_newsletter_confirmation( $email, $data = [] ) {
	$email = sanitize_email( $email );
	if ( ! is_email( $email ) ) {
		return false;
	}

	$admin_email = sanitize_email( get_option( 'admin_email' ) );
	$from_name   = get_bloginfo( 'name' );
	if ( empty( $from_name ) ) {
		$from_name = 'LakeHub Social';
	}

	$from_header = sprintf( 'From: %s <%s>', wp_specialchars_decode( $from_name, ENT_QUOTES ), $admin_email );
	$headers     = [
		'Content-Type: text/html; charset=UTF-8',
		$from_header,
	];

	$subject  = sprintf( __( 'Welcome to the %s Newsletter', 'lakehub-site' ), $from_name );
	$site_url = home_url();

	$message  = '<!DOCTYPE html>' . "\n";
	$message .= '<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>' . esc_html( $subject ) . '</title></head>' . "\n";
	$message .= '<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">' . "\n";
	$message .= '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f3f4f6; padding: 32px 16px;">' . "\n";
	$message .= '<tr><td align="center">' . "\n";
	$message .= '<table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); text-align: left;" cellspacing="0" cellpadding="0" border="0">' . "\n";
	// Header banner
	$message .= '<tr><td style="background-color: #00676B; padding: 28px 32px; text-align: left;">' . "\n";
	$message .= '<h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">LakeHub Social</h1>' . "\n";
	$message .= '<p style="margin: 4px 0 0 0; font-size: 14px; color: #c9ecee;">Empowering communities through technology & social innovation</p>' . "\n";
	$message .= '</td></tr>' . "\n";
	// Body content
	$message .= '<tr><td style="padding: 32px;">' . "\n";
	$message .= '<h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #111827;">Thank you for subscribing!</h2>' . "\n";
	$message .= '<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">You are now subscribed to the LakeHub newsletter. We are thrilled to welcome you to our community of innovators, changemakers, and supporters across East Africa.</p>' . "\n";
	$message .= '<div style="background-color: #f8fafc; border-left: 4px solid #00676B; padding: 16px; border-radius: 4px; margin: 20px 0;">' . "\n";
	$message .= '<h3 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #00676B;">What to expect:</h3>' . "\n";
	$message .= '<ul style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6; color: #4b5563;">' . "\n";
	$message .= '<li>Inspiring stories of impact from our grassroots programs.</li>' . "\n";
	$message .= '<li>Updates on youth and women empowerment through tech and entrepreneurship.</li>' . "\n";
	$message .= '<li>Upcoming events, workshops, hackathons, and community opportunities.</li>' . "\n";
	$message .= '</ul>' . "\n";
	$message .= '</div>' . "\n";
	$message .= '<p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.5; color: #6b7280;"><em>Note: If you receive a confirmation email from Mailchimp, please click the verification button to confirm your preferences.</em></p>' . "\n";
	$message .= '<div style="text-align: center; margin: 32px 0 16px 0;">' . "\n";
	$message .= '<a href="' . esc_url( $site_url ) . '" style="background-color: #00676B; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 15px; padding: 12px 28px; border-radius: 9999px; display: inline-block;">Visit LakeHub Social</a>' . "\n";
	$message .= '</div>' . "\n";
	$message .= '</td></tr>' . "\n";
	// Footer
	$message .= '<tr><td style="background-color: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; font-size: 12px; line-height: 1.5; color: #9ca3af; text-align: center;">' . "\n";
	$message .= '<p style="margin: 0 0 4px 0;">© ' . gmdate( 'Y' ) . ' LakeHub Foundation. All rights reserved.</p>' . "\n";
	$message .= '<p style="margin: 0;">Kisumu, Kenya · <a href="' . esc_url( $site_url ) . '" style="color: #00676B; text-decoration: underline;">lakehub.co.ke</a></p>' . "\n";
	$message .= '</td></tr>' . "\n";
	$message .= '</table>' . "\n";
	$message .= '</td></tr></table>' . "\n";
	$message .= '</body></html>';

	// Always record the prepared email event in a transient for auditing and verification tests
	set_transient( 'lakehub_last_newsletter_email', [
		'to'      => $email,
		'subject' => $subject,
		'from'    => $from_header,
		'time'    => current_time( 'mysql' ),
	], 3600 );

	$sent = @wp_mail( $email, $subject, $message, $headers );

	return (bool) $sent;
}

// Hook into Mailchimp for WordPress form submission success
add_action( 'mc4wp_form_subscribed', function( $form, $email, $data ) {
	lakehub_send_newsletter_confirmation( $email, $data );
}, 10, 3 );


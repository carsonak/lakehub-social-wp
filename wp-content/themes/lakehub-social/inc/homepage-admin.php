<?php
/** Native WordPress controls for protected LakeHub layouts. @package LakeHub_Social */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Register structured homepage metadata. */
function lakehub_social_register_home_meta() {
	foreach ( array( 'hero', 'impact', 'journey', 'partners', 'insights', 'cta' ) as $section ) {
		register_post_meta(
			'page',
			'_lakehub_v2_' . $section,
			array(
				'type'              => 'array',
				'single'            => true,
				'show_in_rest'      => false,
				'revisions_enabled' => true,
				'sanitize_callback' => 'lakehub_social_sanitize_home_meta',
				'auth_callback'     => static function () { return current_user_can( 'edit_pages' ); },
			)
		);
	}
}
add_action( 'init', 'lakehub_social_register_home_meta' );

/** Defensive recursive sanitizer; the save handler applies field-specific rules. */
function lakehub_social_sanitize_home_meta( $value ) {
	if ( ! is_array( $value ) ) { return array(); }
	return array_map(
		static function ( $item ) {
			return is_array( $item ) ? lakehub_social_sanitize_home_meta( $item ) : sanitize_textarea_field( (string) $item );
		},
		$value
	);
}

/** Add the homepage editor only to the configured front page. */
function lakehub_social_add_homepage_meta_box( $post ) {
	$front_page_id = absint( get_option( 'page_on_front' ) );
	if ( $front_page_id && $front_page_id !== (int) $post->ID ) { return; }
	add_meta_box( 'lakehub-homepage-content', __( 'LakeHub Homepage', 'lakehub-social' ), 'lakehub_social_render_homepage_meta_box', 'page', 'normal', 'high' );
}
add_action( 'add_meta_boxes_page', 'lakehub_social_add_homepage_meta_box' );

/** Render a reusable editor field. */
function lakehub_social_admin_field( $name, $label, $value, $type = 'text' ) {
	$id = sanitize_html_class( str_replace( array( '[', ']' ), '-', $name ) );
	echo '<p class="lakehub-field"><label for="' . esc_attr( $id ) . '"><strong>' . esc_html( $label ) . '</strong></label>';
	if ( 'textarea' === $type ) {
		echo '<textarea class="widefat" rows="4" id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '">' . esc_textarea( $value ) . '</textarea>';
	} elseif ( 'media' === $type ) {
		$image_id = absint( $value );
		echo '<span class="lakehub-media-field"><input class="lakehub-media-id" type="hidden" id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( $image_id ) . '"><span class="lakehub-media-preview">' . ( $image_id ? wp_get_attachment_image( $image_id, 'thumbnail' ) : '' ) . '</span><button type="button" class="button lakehub-select-media">' . esc_html__( 'Choose image', 'lakehub-social' ) . '</button> <button type="button" class="button-link-delete lakehub-remove-media">' . esc_html__( 'Remove', 'lakehub-social' ) . '</button></span>';
	} else {
		echo '<input class="widefat" type="text"' . ( 'url' === $type ? ' inputmode="url"' : '' ) . ' id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( $value ) . '">';
	}
	echo '</p>';
}

/** Render the complete structured homepage editor. */
function lakehub_social_render_homepage_meta_box( $post ) {
	wp_nonce_field( 'lakehub_social_save_homepage', 'lakehub_social_homepage_nonce' );
	$hero     = lakehub_social_get_home_section( 'hero', $post->ID );
	$impact   = lakehub_social_get_home_section( 'impact', $post->ID );
	$journey  = lakehub_social_get_home_section( 'journey', $post->ID );
	$partners = lakehub_social_get_home_section( 'partners', $post->ID );
	$insights = lakehub_social_get_home_section( 'insights', $post->ID );
	$cta      = lakehub_social_get_home_section( 'cta', $post->ID );

	echo '<p class="description">' . esc_html__( 'Edit content here while the Figma-matched layout remains protected by the theme.', 'lakehub-social' ) . '</p><div class="lakehub-admin-sections">';
	echo '<details open><summary>' . esc_html__( 'Hero', 'lakehub-social' ) . '</summary><div class="lakehub-fields">';
	foreach ( array( 'title' => 'Heading', 'title_accent' => 'Highlighted word', 'title_tail' => 'Heading ending', 'text' => 'Introduction', 'image_id' => 'Image', 'primary_label' => 'Primary button label', 'primary_url' => 'Primary button URL', 'secondary_label' => 'Secondary button label', 'secondary_url' => 'Secondary button URL' ) as $key => $label ) {
		$type = 'image_id' === $key ? 'media' : ( false !== strpos( $key, '_url' ) ? 'url' : ( 'text' === $key ? 'textarea' : 'text' ) );
		lakehub_social_admin_field( "lakehub[hero][{$key}]", __( $label, 'lakehub-social' ), $hero[ $key ], $type ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText
	}
	echo '</div></details>';

	echo '<details><summary>' . esc_html__( 'Impact through Precision', 'lakehub-social' ) . '</summary><div class="lakehub-fields">';
	foreach ( array( 'title' => 'Heading', 'title_accent' => 'Highlighted word', 'intro' => 'Introduction', 'incubator_image_id' => 'Incubator image', 'incubator_text' => 'Incubator statement', 'incubator_label' => 'Link label', 'incubator_url' => 'Link URL', 'community_image_id' => 'Community image', 'programs_image_id' => 'Programs image', 'programs_text' => 'Programs statement' ) as $key => $label ) {
		$type = false !== strpos( $key, 'image_id' ) ? 'media' : ( false !== strpos( $key, '_url' ) ? 'url' : ( in_array( $key, array( 'intro', 'incubator_text', 'programs_text' ), true ) ? 'textarea' : 'text' ) );
		lakehub_social_admin_field( "lakehub[impact][{$key}]", __( $label, 'lakehub-social' ), $impact[ $key ], $type ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText
	}
	echo '</div></details>';

	echo '<details><summary>' . esc_html__( 'Our Journey', 'lakehub-social' ) . '</summary><div class="lakehub-fields">';
	lakehub_social_admin_field( 'lakehub[journey][title]', __( 'Heading', 'lakehub-social' ), $journey['title'] );
	lakehub_social_admin_field( 'lakehub[journey][intro]', __( 'Introduction', 'lakehub-social' ), $journey['intro'] );
	echo '<div class="lakehub-repeater">';
	foreach ( $journey['milestones'] as $index => $item ) { lakehub_social_render_milestone_row( $index, $item ); }
	echo '</div><button type="button" class="button lakehub-add-row" data-template="lakehub-milestone-template">' . esc_html__( 'Add milestone', 'lakehub-social' ) . '</button><template id="lakehub-milestone-template">';
	lakehub_social_render_milestone_row( '__INDEX__', array( 'year' => '', 'title' => '', 'text' => '' ) );
	echo '</template></div></details>';

	echo '<details><summary>' . esc_html__( 'Partner carousel', 'lakehub-social' ) . '</summary><div class="lakehub-fields">';
	lakehub_social_admin_field( 'lakehub[partners][label]', __( 'Label', 'lakehub-social' ), $partners['label'] );
	echo '<div class="lakehub-repeater">';
	foreach ( $partners['items'] as $index => $item ) { lakehub_social_render_partner_row( $index, $item ); }
	echo '</div><button type="button" class="button lakehub-add-row" data-template="lakehub-partner-template">' . esc_html__( 'Add partner', 'lakehub-social' ) . '</button><template id="lakehub-partner-template">';
	lakehub_social_render_partner_row( '__INDEX__', array( 'name' => '', 'logo_id' => 0, 'logo_file' => '', 'url' => '' ) );
	echo '</template></div></details>';

	echo '<details><summary>' . esc_html__( 'Latest Insights', 'lakehub-social' ) . '</summary><div class="lakehub-fields">';
	lakehub_social_admin_field( 'lakehub[insights][title]', __( 'Heading', 'lakehub-social' ), $insights['title'] );
	lakehub_social_admin_field( 'lakehub[insights][intro]', __( 'Introduction', 'lakehub-social' ), $insights['intro'] );
	echo '<p class="description">' . esc_html__( 'The three newest published posts appear automatically.', 'lakehub-social' ) . '</p></div></details>';

	echo '<details><summary>' . esc_html__( 'Call to action', 'lakehub-social' ) . '</summary><div class="lakehub-fields">';
	foreach ( array( 'title' => 'Heading', 'text' => 'Text', 'button_label' => 'Button label', 'button_url' => 'Button URL' ) as $key => $label ) {
		lakehub_social_admin_field( "lakehub[cta][{$key}]", __( $label, 'lakehub-social' ), $cta[ $key ], 'button_url' === $key ? 'url' : ( 'text' === $key ? 'textarea' : 'text' ) ); // phpcs:ignore WordPress.WP.I18n.NonSingularStringLiteralText
	}
	echo '</div></details></div>';
}

function lakehub_social_render_milestone_row( $index, $item ) {
	echo '<div class="lakehub-repeater-row"><div class="lakehub-row-actions"><button type="button" class="button lakehub-move-up">↑</button><button type="button" class="button lakehub-move-down">↓</button><button type="button" class="button-link-delete lakehub-remove-row">' . esc_html__( 'Remove', 'lakehub-social' ) . '</button></div>';
	lakehub_social_admin_field( "lakehub[journey][milestones][{$index}][year]", __( 'Year', 'lakehub-social' ), $item['year'] );
	lakehub_social_admin_field( "lakehub[journey][milestones][{$index}][title]", __( 'Title', 'lakehub-social' ), $item['title'] );
	lakehub_social_admin_field( "lakehub[journey][milestones][{$index}][text]", __( 'Text', 'lakehub-social' ), $item['text'], 'textarea' );
	echo '</div>';
}

function lakehub_social_render_partner_row( $index, $item ) {
	echo '<div class="lakehub-repeater-row"><div class="lakehub-row-actions"><button type="button" class="button lakehub-move-up">↑</button><button type="button" class="button lakehub-move-down">↓</button><button type="button" class="button-link-delete lakehub-remove-row">' . esc_html__( 'Remove', 'lakehub-social' ) . '</button></div>';
	lakehub_social_admin_field( "lakehub[partners][items][{$index}][name]", __( 'Organization', 'lakehub-social' ), $item['name'] );
	lakehub_social_admin_field( "lakehub[partners][items][{$index}][logo_id]", __( 'Logo', 'lakehub-social' ), $item['logo_id'], 'media' );
	echo '<input type="hidden" name="' . esc_attr( "lakehub[partners][items][{$index}][logo_file]" ) . '" value="' . esc_attr( isset( $item['logo_file'] ) ? $item['logo_file'] : '' ) . '">';
	lakehub_social_admin_field( "lakehub[partners][items][{$index}][url]", __( 'Website URL', 'lakehub-social' ), $item['url'], 'url' );
	echo '</div>';
}

/** Save field-specific, sanitized homepage data. */
function lakehub_social_save_homepage( $post_id ) {
	if ( ! isset( $_POST['lakehub_social_homepage_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['lakehub_social_homepage_nonce'] ) ), 'lakehub_social_save_homepage' ) || ! current_user_can( 'edit_page', $post_id ) || wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) || empty( $_POST['lakehub'] ) || ! is_array( $_POST['lakehub'] ) ) { return; }
	$input = wp_unslash( $_POST['lakehub'] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
	$clean = lakehub_social_sanitize_submitted_homepage( $input );
	foreach ( $clean as $section => $value ) { update_post_meta( $post_id, '_lakehub_v2_' . $section, $value ); }
}
add_action( 'save_post_page', 'lakehub_social_save_homepage' );

/** Sanitize the known homepage schema. */
function lakehub_social_sanitize_submitted_homepage( $input ) {
	$text = static function ( $value ) { return sanitize_text_field( (string) $value ); };
	$area = static function ( $value ) { return sanitize_textarea_field( (string) $value ); };
	$url  = static function ( $value ) { return esc_url_raw( (string) $value, array( 'http', 'https', 'mailto', 'tel' ) ); };
	$get  = static function ( $array, $key ) { return isset( $array[ $key ] ) ? $array[ $key ] : ''; };
	$defaults = lakehub_social_homepage_defaults();
	$clean = array();
	foreach ( array( 'hero', 'impact', 'journey', 'partners', 'insights', 'cta' ) as $section ) { $input[ $section ] = isset( $input[ $section ] ) && is_array( $input[ $section ] ) ? $input[ $section ] : array(); }
	$clean['hero'] = array();
	foreach ( $defaults['hero'] as $key => $value ) { $clean['hero'][ $key ] = 'image_id' === $key ? absint( $get( $input['hero'], $key ) ) : ( false !== strpos( $key, '_url' ) ? $url( $get( $input['hero'], $key ) ) : ( 'text' === $key ? $area( $get( $input['hero'], $key ) ) : $text( $get( $input['hero'], $key ) ) ) ); }
	$clean['impact'] = array();
	foreach ( $defaults['impact'] as $key => $value ) { $clean['impact'][ $key ] = false !== strpos( $key, 'image_id' ) ? absint( $get( $input['impact'], $key ) ) : ( false !== strpos( $key, '_url' ) ? $url( $get( $input['impact'], $key ) ) : ( in_array( $key, array( 'intro', 'incubator_text', 'programs_text' ), true ) ? $area( $get( $input['impact'], $key ) ) : $text( $get( $input['impact'], $key ) ) ) ); }
	$clean['journey'] = array( 'title' => $text( $get( $input['journey'], 'title' ) ), 'intro' => $area( $get( $input['journey'], 'intro' ) ), 'milestones' => array() );
	foreach ( isset( $input['journey']['milestones'] ) && is_array( $input['journey']['milestones'] ) ? $input['journey']['milestones'] : array() as $item ) { if ( is_array( $item ) ) { $clean['journey']['milestones'][] = array( 'year' => $text( $get( $item, 'year' ) ), 'title' => $text( $get( $item, 'title' ) ), 'text' => $area( $get( $item, 'text' ) ) ); } }
	$clean['partners'] = array( 'label' => $text( $get( $input['partners'], 'label' ) ), 'items' => array() );
	foreach ( isset( $input['partners']['items'] ) && is_array( $input['partners']['items'] ) ? $input['partners']['items'] : array() as $item ) { if ( is_array( $item ) ) { $logo_file = ltrim( str_replace( '..', '', $text( $get( $item, 'logo_file' ) ) ), '/' ); $clean['partners']['items'][] = array( 'name' => $text( $get( $item, 'name' ) ), 'logo_id' => absint( $get( $item, 'logo_id' ) ), 'logo_file' => $logo_file, 'url' => $url( $get( $item, 'url' ) ) ); } }
	$clean['insights'] = array( 'title' => $text( $get( $input['insights'], 'title' ) ), 'intro' => $area( $get( $input['insights'], 'intro' ) ) );
	$clean['cta'] = array( 'title' => $text( $get( $input['cta'], 'title' ) ), 'text' => $area( $get( $input['cta'], 'text' ) ), 'button_label' => $text( $get( $input['cta'], 'button_label' ) ), 'button_url' => $url( $get( $input['cta'], 'button_url' ) ) );
	return $clean;
}

/** Load the media/repeater editor only on page edit screens. */
function lakehub_social_admin_assets( $hook ) {
	if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) || ! get_current_screen() || 'page' !== get_current_screen()->post_type ) { return; }
	wp_enqueue_media();
	wp_enqueue_script( 'lakehub-homepage-admin', get_theme_file_uri( 'assets/js/homepage-admin.js' ), array(), wp_get_theme()->get( 'Version' ), true );
	wp_enqueue_style( 'lakehub-homepage-admin', get_theme_file_uri( 'assets/css/homepage-admin.css' ), array(), wp_get_theme()->get( 'Version' ) );
}
add_action( 'admin_enqueue_scripts', 'lakehub_social_admin_assets' );

/** Register site-wide footer destinations. */
function lakehub_social_register_site_settings() {
	foreach ( array( 'linkedin_url', 'facebook_url', 'x_url', 'privacy_url', 'contact_url' ) as $field ) {
		register_setting( 'lakehub_social_site', 'lakehub_social_' . $field, array( 'type' => 'string', 'sanitize_callback' => 'esc_url_raw', 'default' => '' ) );
	}
}
add_action( 'admin_init', 'lakehub_social_register_site_settings' );

function lakehub_social_add_settings_page() { add_theme_page( __( 'LakeHub Site Settings', 'lakehub-social' ), __( 'LakeHub Site Settings', 'lakehub-social' ), 'manage_options', 'lakehub-site-settings', 'lakehub_social_render_settings_page' ); }
add_action( 'admin_menu', 'lakehub_social_add_settings_page' );

function lakehub_social_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) { return; }
	$labels = array( 'linkedin_url' => 'LinkedIn URL', 'facebook_url' => 'Facebook URL', 'x_url' => 'X URL', 'privacy_url' => 'Privacy policy URL', 'contact_url' => 'Contact URL' );
	echo '<div class="wrap"><h1>' . esc_html__( 'LakeHub Site Settings', 'lakehub-social' ) . '</h1><form method="post" action="options.php">';
	settings_fields( 'lakehub_social_site' );
	echo '<table class="form-table" role="presentation">';
	foreach ( $labels as $field => $label ) { echo '<tr><th><label for="lakehub_social_' . esc_attr( $field ) . '">' . esc_html( $label ) . '</label></th><td><input class="regular-text" type="url" id="lakehub_social_' . esc_attr( $field ) . '" name="lakehub_social_' . esc_attr( $field ) . '" value="' . esc_attr( get_option( 'lakehub_social_' . $field, '' ) ) . '"></td></tr>'; }
	echo '</table>'; submit_button(); echo '</form></div>';
}

<?php
/**
 * Native WordPress editing controls for the LakeHub homepage.
 *
 * @package LakeHub_Social
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Register the protected homepage meta fields. */
function lakehub_social_register_home_meta() {
	foreach ( array( 'hero', 'mission', 'journey', 'partners', 'insights', 'cta' ) as $section ) {
		register_post_meta(
			'page',
			'_lakehub_' . $section,
			array(
				'type'              => 'array',
				'single'            => true,
				'show_in_rest'      => false,
				'revisions_enabled' => true,
				'sanitize_callback' => 'lakehub_social_sanitize_home_meta',
				'auth_callback'     => static function () {
					return current_user_can( 'edit_pages' );
				},
			)
		);
	}
}
add_action( 'init', 'lakehub_social_register_home_meta' );

/**
 * Sanitize an arbitrary nested value from a homepage field.
 *
 * URLs and IDs receive stricter handling in the section sanitizer below.
 *
 * @param mixed $value Submitted value.
 * @return mixed
 */
function lakehub_social_sanitize_nested_text( $value ) {
	if ( is_array( $value ) ) {
		return array_map( 'lakehub_social_sanitize_nested_text', $value );
	}
	return sanitize_textarea_field( wp_unslash( (string) $value ) );
}

/**
 * Sanitize registered homepage meta as a defensive fallback.
 *
 * @param mixed $value Submitted value.
 * @return array
 */
function lakehub_social_sanitize_home_meta( $value ) {
	return is_array( $value ) ? lakehub_social_sanitize_nested_text( $value ) : array();
}

/** Add the homepage editor meta box. */
function lakehub_social_add_homepage_meta_box( $post ) {
	$front_page_id = absint( get_option( 'page_on_front' ) );
	if ( $front_page_id && $front_page_id !== (int) $post->ID ) {
		return;
	}
	add_meta_box(
		'lakehub-homepage-content',
		__( 'LakeHub Homepage', 'lakehub-social' ),
		'lakehub_social_render_homepage_meta_box',
		'page',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes_page', 'lakehub_social_add_homepage_meta_box' );

/**
 * Render a field.
 *
 * @param string $name  Input name.
 * @param string $label Label.
 * @param mixed  $value Current value.
 * @param string $type  Field type.
 */
function lakehub_social_admin_field( $name, $label, $value, $type = 'text' ) {
	$id = sanitize_html_class( str_replace( array( '[', ']' ), '-', $name ) );
	echo '<p class="lakehub-field">';
	echo '<label for="' . esc_attr( $id ) . '"><strong>' . esc_html( $label ) . '</strong></label>';
	if ( 'textarea' === $type ) {
		echo '<textarea class="widefat" rows="4" id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '">' . esc_textarea( $value ) . '</textarea>';
	} elseif ( 'media' === $type ) {
		$image_id = absint( $value );
		echo '<span class="lakehub-media-field">';
		echo '<input class="lakehub-media-id" type="hidden" id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( $image_id ) . '">';
		echo '<span class="lakehub-media-preview">' . ( $image_id ? wp_get_attachment_image( $image_id, 'thumbnail' ) : '' ) . '</span>';
		echo '<button type="button" class="button lakehub-select-media">' . esc_html__( 'Choose image', 'lakehub-social' ) . '</button> ';
		echo '<button type="button" class="button-link-delete lakehub-remove-media">' . esc_html__( 'Remove', 'lakehub-social' ) . '</button>';
		echo '</span>';
	} else {
		$input_type = 'url' === $type ? 'text' : $type;
		$inputmode  = 'url' === $type ? ' inputmode="url"' : '';
		echo '<input class="widefat" type="' . esc_attr( $input_type ) . '"' . $inputmode . ' id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '" value="' . esc_attr( $value ) . '">';
	}
	echo '</p>';
}

/** Render the complete structured homepage editor. */
function lakehub_social_render_homepage_meta_box( $post ) {
	wp_nonce_field( 'lakehub_social_save_homepage', 'lakehub_social_homepage_nonce' );
	$defaults = lakehub_social_homepage_defaults();
	$hero     = lakehub_social_get_home_section( 'hero', $post->ID );
	$mission  = lakehub_social_get_home_section( 'mission', $post->ID );
	$journey  = lakehub_social_get_home_section( 'journey', $post->ID );
	$partners = lakehub_social_get_home_section( 'partners', $post->ID );
	$insights = lakehub_social_get_home_section( 'insights', $post->ID );
	$cta      = lakehub_social_get_home_section( 'cta', $post->ID );

	echo '<p class="description">' . esc_html__( 'These fields control the homepage while its layout remains protected by the theme.', 'lakehub-social' ) . '</p>';
	echo '<div class="lakehub-admin-sections">';

	echo '<details open><summary>' . esc_html__( 'Hero', 'lakehub-social' ) . '</summary><div class="lakehub-fields">';
	lakehub_social_admin_field( 'lakehub[hero][eyebrow]', __( 'Eyebrow', 'lakehub-social' ), $hero['eyebrow'] );
	lakehub_social_admin_field( 'lakehub[hero][title]', __( 'Heading', 'lakehub-social' ), $hero['title'] );
	lakehub_social_admin_field( 'lakehub[hero][title_accent]', __( 'Highlighted heading', 'lakehub-social' ), $hero['title_accent'] );
	lakehub_social_admin_field( 'lakehub[hero][text]', __( 'Introduction', 'lakehub-social' ), $hero['text'], 'textarea' );
	lakehub_social_admin_field( 'lakehub[hero][image_id]', __( 'Image', 'lakehub-social' ), $hero['image_id'], 'media' );
	lakehub_social_admin_field( 'lakehub[hero][primary_label]', __( 'Primary button label', 'lakehub-social' ), $hero['primary_label'] );
	lakehub_social_admin_field( 'lakehub[hero][primary_url]', __( 'Primary button URL', 'lakehub-social' ), $hero['primary_url'], 'url' );
	lakehub_social_admin_field( 'lakehub[hero][secondary_label]', __( 'Secondary button label', 'lakehub-social' ), $hero['secondary_label'] );
	lakehub_social_admin_field( 'lakehub[hero][secondary_url]', __( 'Secondary button URL', 'lakehub-social' ), $hero['secondary_url'], 'url' );
	echo '</div></details>';

	echo '<details><summary>' . esc_html__( 'About and what we do', 'lakehub-social' ) . '</summary><div class="lakehub-fields lakehub-fields--two">';
	foreach ( array( 'about' => __( 'Who we are', 'lakehub-social' ), 'work' => __( 'What we do', 'lakehub-social' ) ) as $prefix => $heading ) {
		echo '<fieldset><legend>' . esc_html( $heading ) . '</legend>';
		lakehub_social_admin_field( "lakehub[mission][{$prefix}_eyebrow]", __( 'Eyebrow', 'lakehub-social' ), $mission[ $prefix . '_eyebrow' ] );
		lakehub_social_admin_field( "lakehub[mission][{$prefix}_title]", __( 'Heading', 'lakehub-social' ), $mission[ $prefix . '_title' ] );
		lakehub_social_admin_field( "lakehub[mission][{$prefix}_text]", __( 'Text', 'lakehub-social' ), $mission[ $prefix . '_text' ], 'textarea' );
		lakehub_social_admin_field( "lakehub[mission][{$prefix}_image_id]", __( 'Image', 'lakehub-social' ), $mission[ $prefix . '_image_id' ], 'media' );
		echo '</fieldset>';
	}
	echo '</div></details>';

	echo '<details><summary>' . esc_html__( 'Journey', 'lakehub-social' ) . '</summary><div class="lakehub-fields">';
	lakehub_social_admin_field( 'lakehub[journey][eyebrow]', __( 'Eyebrow', 'lakehub-social' ), $journey['eyebrow'] );
	lakehub_social_admin_field( 'lakehub[journey][title]', __( 'Heading', 'lakehub-social' ), $journey['title'] );
	lakehub_social_admin_field( 'lakehub[journey][intro]', __( 'Introduction', 'lakehub-social' ), $journey['intro'], 'textarea' );
	echo '<h4>' . esc_html__( 'Milestones', 'lakehub-social' ) . '</h4><div class="lakehub-repeater" data-repeater="milestones">';
	foreach ( $journey['milestones'] as $index => $item ) {
		lakehub_social_render_milestone_row( $item, $index );
	}
	echo '</div><button type="button" class="button lakehub-add-row" data-template="lakehub-milestone-template">' . esc_html__( 'Add milestone', 'lakehub-social' ) . '</button>';
	echo '</div></details>';

	echo '<details><summary>' . esc_html__( 'Partners', 'lakehub-social' ) . '</summary><div class="lakehub-fields">';
	lakehub_social_admin_field( 'lakehub[partners][label]', __( 'Section label', 'lakehub-social' ), $partners['label'] );
	echo '<div class="lakehub-repeater" data-repeater="partners">';
	foreach ( $partners['items'] as $index => $item ) {
		lakehub_social_render_partner_row( $item, $index );
	}
	echo '</div><button type="button" class="button lakehub-add-row" data-template="lakehub-partner-template">' . esc_html__( 'Add partner', 'lakehub-social' ) . '</button>';
	echo '</div></details>';

	echo '<details><summary>' . esc_html__( 'Insights', 'lakehub-social' ) . '</summary><div class="lakehub-fields">';
	lakehub_social_admin_field( 'lakehub[insights][eyebrow]', __( 'Eyebrow', 'lakehub-social' ), $insights['eyebrow'] );
	lakehub_social_admin_field( 'lakehub[insights][title]', __( 'Heading', 'lakehub-social' ), $insights['title'] );
	lakehub_social_admin_field( 'lakehub[insights][intro]', __( 'Introduction', 'lakehub-social' ), $insights['intro'], 'textarea' );
	$posts = get_posts( array( 'post_type' => 'post', 'post_status' => 'publish', 'numberposts' => 100, 'orderby' => 'date', 'order' => 'DESC' ) );
	echo '<p class="lakehub-field"><label for="lakehub-insight-posts"><strong>' . esc_html__( 'Featured posts (choose up to three)', 'lakehub-social' ) . '</strong></label>';
	echo '<select class="widefat" id="lakehub-insight-posts" name="lakehub[insights][post_ids][]" multiple size="8">';
	foreach ( $posts as $item ) {
		echo '<option value="' . esc_attr( $item->ID ) . '" ' . selected( in_array( $item->ID, array_map( 'absint', $insights['post_ids'] ), true ), true, false ) . '>' . esc_html( $item->post_title ) . '</option>';
	}
	echo '</select><span class="description">' . esc_html__( 'If none are selected, the latest three published posts are used.', 'lakehub-social' ) . '</span></p>';
	echo '</div></details>';

	echo '<details><summary>' . esc_html__( 'Call to action', 'lakehub-social' ) . '</summary><div class="lakehub-fields">';
	lakehub_social_admin_field( 'lakehub[cta][title]', __( 'Heading', 'lakehub-social' ), $cta['title'] );
	lakehub_social_admin_field( 'lakehub[cta][text]', __( 'Text', 'lakehub-social' ), $cta['text'], 'textarea' );
	lakehub_social_admin_field( 'lakehub[cta][button_label]', __( 'Button label', 'lakehub-social' ), $cta['button_label'] );
	lakehub_social_admin_field( 'lakehub[cta][button_url]', __( 'Button URL', 'lakehub-social' ), $cta['button_url'], 'url' );
	echo '</div></details></div>';

	lakehub_social_render_repeater_templates();
}

/** Render a milestone row. */
function lakehub_social_render_milestone_row( $item, $index ) {
	echo '<div class="lakehub-repeater-row">';
	lakehub_social_admin_field( "lakehub[journey][milestones][{$index}][year]", __( 'Year', 'lakehub-social' ), isset( $item['year'] ) ? $item['year'] : '' );
	lakehub_social_admin_field( "lakehub[journey][milestones][{$index}][title]", __( 'Title', 'lakehub-social' ), isset( $item['title'] ) ? $item['title'] : '' );
	lakehub_social_admin_field( "lakehub[journey][milestones][{$index}][text]", __( 'Text', 'lakehub-social' ), isset( $item['text'] ) ? $item['text'] : '', 'textarea' );
	lakehub_social_row_actions();
	echo '</div>';
}

/** Render a partner row. */
function lakehub_social_render_partner_row( $item, $index ) {
	echo '<div class="lakehub-repeater-row">';
	lakehub_social_admin_field( "lakehub[partners][items][{$index}][name]", __( 'Partner name', 'lakehub-social' ), isset( $item['name'] ) ? $item['name'] : '' );
	lakehub_social_admin_field( "lakehub[partners][items][{$index}][logo_id]", __( 'Logo', 'lakehub-social' ), isset( $item['logo_id'] ) ? $item['logo_id'] : 0, 'media' );
	lakehub_social_admin_field( "lakehub[partners][items][{$index}][url]", __( 'Link URL', 'lakehub-social' ), isset( $item['url'] ) ? $item['url'] : '', 'url' );
	lakehub_social_row_actions();
	echo '</div>';
}

/** Render row controls. */
function lakehub_social_row_actions() {
	echo '<p class="lakehub-row-actions"><button type="button" class="button lakehub-move-up" aria-label="' . esc_attr__( 'Move up', 'lakehub-social' ) . '">↑</button> <button type="button" class="button lakehub-move-down" aria-label="' . esc_attr__( 'Move down', 'lakehub-social' ) . '">↓</button> <button type="button" class="button-link-delete lakehub-remove-row">' . esc_html__( 'Remove', 'lakehub-social' ) . '</button></p>';
}

/** Render inert repeater templates. */
function lakehub_social_render_repeater_templates() {
	echo '<template id="lakehub-milestone-template">';
	lakehub_social_render_milestone_row( array( 'year' => '', 'title' => '', 'text' => '' ), '__INDEX__' );
	echo '</template><template id="lakehub-partner-template">';
	lakehub_social_render_partner_row( array( 'name' => '', 'logo_id' => 0, 'url' => '' ), '__INDEX__' );
	echo '</template>';
}

/**
 * Save and strictly sanitize the homepage data.
 *
 * @param int $post_id Page ID.
 */
function lakehub_social_save_homepage_meta( $post_id ) {
	if ( ! isset( $_POST['lakehub_social_homepage_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['lakehub_social_homepage_nonce'] ) ), 'lakehub_social_save_homepage' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_page', $post_id ) || ! isset( $_POST['lakehub'] ) || ! is_array( $_POST['lakehub'] ) ) {
		return;
	}

	$input = wp_unslash( $_POST['lakehub'] );
	$clean = lakehub_social_sanitize_submitted_homepage( $input );
	foreach ( $clean as $section => $value ) {
		update_post_meta( $post_id, '_lakehub_' . $section, $value );
	}
}
add_action( 'save_post_page', 'lakehub_social_save_homepage_meta' );

/**
 * Strict section-aware homepage sanitization.
 *
 * @param array $input Posted values.
 * @return array<string, array>
 */
function lakehub_social_sanitize_submitted_homepage( $input ) {
	$text = static function ( $value ) { return sanitize_text_field( (string) $value ); };
	$area = static function ( $value ) { return sanitize_textarea_field( (string) $value ); };
	$url  = static function ( $value ) { return esc_url_raw( (string) $value, array( 'http', 'https', 'mailto', 'tel' ) ); };
	$get  = static function ( $array, $key ) { return isset( $array[ $key ] ) ? $array[ $key ] : ''; };

	$hero = isset( $input['hero'] ) && is_array( $input['hero'] ) ? $input['hero'] : array();
	$mission = isset( $input['mission'] ) && is_array( $input['mission'] ) ? $input['mission'] : array();
	$journey = isset( $input['journey'] ) && is_array( $input['journey'] ) ? $input['journey'] : array();
	$partners = isset( $input['partners'] ) && is_array( $input['partners'] ) ? $input['partners'] : array();
	$insights = isset( $input['insights'] ) && is_array( $input['insights'] ) ? $input['insights'] : array();
	$cta = isset( $input['cta'] ) && is_array( $input['cta'] ) ? $input['cta'] : array();

	$clean = array(
		'hero' => array(
			'eyebrow' => $text( $get( $hero, 'eyebrow' ) ), 'title' => $text( $get( $hero, 'title' ) ), 'title_accent' => $text( $get( $hero, 'title_accent' ) ),
			'text' => $area( $get( $hero, 'text' ) ), 'image_id' => absint( $get( $hero, 'image_id' ) ),
			'primary_label' => $text( $get( $hero, 'primary_label' ) ), 'primary_url' => $url( $get( $hero, 'primary_url' ) ),
			'secondary_label' => $text( $get( $hero, 'secondary_label' ) ), 'secondary_url' => $url( $get( $hero, 'secondary_url' ) ),
		),
		'mission' => array(),
		'journey' => array( 'eyebrow' => $text( $get( $journey, 'eyebrow' ) ), 'title' => $text( $get( $journey, 'title' ) ), 'intro' => $area( $get( $journey, 'intro' ) ), 'milestones' => array() ),
		'partners' => array( 'label' => $text( $get( $partners, 'label' ) ), 'items' => array() ),
		'insights' => array( 'eyebrow' => $text( $get( $insights, 'eyebrow' ) ), 'title' => $text( $get( $insights, 'title' ) ), 'intro' => $area( $get( $insights, 'intro' ) ), 'post_ids' => array_slice( array_values( array_filter( array_map( 'absint', isset( $insights['post_ids'] ) && is_array( $insights['post_ids'] ) ? $insights['post_ids'] : array() ) ) ), 0, 3 ) ),
		'cta' => array( 'title' => $text( $get( $cta, 'title' ) ), 'text' => $area( $get( $cta, 'text' ) ), 'button_label' => $text( $get( $cta, 'button_label' ) ), 'button_url' => $url( $get( $cta, 'button_url' ) ) ),
	);
	foreach ( array( 'about', 'work' ) as $prefix ) {
		$clean['mission'][ $prefix . '_eyebrow' ] = $text( $get( $mission, $prefix . '_eyebrow' ) );
		$clean['mission'][ $prefix . '_title' ] = $text( $get( $mission, $prefix . '_title' ) );
		$clean['mission'][ $prefix . '_text' ] = $area( $get( $mission, $prefix . '_text' ) );
		$clean['mission'][ $prefix . '_image_id' ] = absint( $get( $mission, $prefix . '_image_id' ) );
	}
	foreach ( isset( $journey['milestones'] ) && is_array( $journey['milestones'] ) ? $journey['milestones'] : array() as $item ) {
		if ( is_array( $item ) && ( $get( $item, 'year' ) || $get( $item, 'title' ) || $get( $item, 'text' ) ) ) {
			$clean['journey']['milestones'][] = array( 'year' => $text( $get( $item, 'year' ) ), 'title' => $text( $get( $item, 'title' ) ), 'text' => $area( $get( $item, 'text' ) ) );
		}
	}
	foreach ( isset( $partners['items'] ) && is_array( $partners['items'] ) ? $partners['items'] : array() as $item ) {
		if ( is_array( $item ) && ( $get( $item, 'name' ) || $get( $item, 'logo_id' ) ) ) {
			$clean['partners']['items'][] = array( 'name' => $text( $get( $item, 'name' ) ), 'logo_id' => absint( $get( $item, 'logo_id' ) ), 'url' => $url( $get( $item, 'url' ) ) );
		}
	}
	return $clean;
}

/** Load media and repeater UI only on page editing screens. */
function lakehub_social_admin_assets( $hook ) {
	if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) || 'page' !== get_current_screen()->post_type ) {
		return;
	}
	wp_enqueue_media();
	wp_enqueue_script( 'lakehub-homepage-admin', get_theme_file_uri( 'assets/js/homepage-admin.js' ), array(), wp_get_theme()->get( 'Version' ), true );
	wp_enqueue_style( 'lakehub-homepage-admin', get_theme_file_uri( 'assets/css/homepage-admin.css' ), array(), wp_get_theme()->get( 'Version' ) );
}
add_action( 'admin_enqueue_scripts', 'lakehub_social_admin_assets' );

/** Register site-wide options and settings page. */
function lakehub_social_register_site_settings() {
	$fields = array( 'tagline', 'address', 'phone', 'email', 'footer_note' );
	foreach ( $fields as $field ) {
		register_setting( 'lakehub_social_site', 'lakehub_social_' . $field, array( 'type' => 'string', 'sanitize_callback' => 'address' === $field ? 'sanitize_textarea_field' : ( 'email' === $field ? 'sanitize_email' : 'sanitize_text_field' ), 'default' => '' ) );
	}
}
add_action( 'admin_init', 'lakehub_social_register_site_settings' );

function lakehub_social_add_settings_page() {
	add_theme_page( __( 'LakeHub Site Settings', 'lakehub-social' ), __( 'LakeHub Site Settings', 'lakehub-social' ), 'manage_options', 'lakehub-site-settings', 'lakehub_social_render_settings_page' );
}
add_action( 'admin_menu', 'lakehub_social_add_settings_page' );

function lakehub_social_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) { return; }
	echo '<div class="wrap"><h1>' . esc_html__( 'LakeHub Site Settings', 'lakehub-social' ) . '</h1><form action="options.php" method="post">';
	settings_fields( 'lakehub_social_site' );
	echo '<table class="form-table" role="presentation">';
	$fields = array( 'tagline' => __( 'Footer tagline', 'lakehub-social' ), 'address' => __( 'Address', 'lakehub-social' ), 'phone' => __( 'Phone', 'lakehub-social' ), 'email' => __( 'Email', 'lakehub-social' ), 'footer_note' => __( 'Footer note', 'lakehub-social' ) );
	foreach ( $fields as $field => $label ) {
		$value = get_option( 'lakehub_social_' . $field, '' );
		echo '<tr><th scope="row"><label for="lakehub-' . esc_attr( $field ) . '">' . esc_html( $label ) . '</label></th><td>';
		if ( 'address' === $field || 'tagline' === $field ) {
			echo '<textarea class="large-text" rows="3" id="lakehub-' . esc_attr( $field ) . '" name="lakehub_social_' . esc_attr( $field ) . '">' . esc_textarea( $value ) . '</textarea>';
		} else {
			echo '<input class="regular-text" id="lakehub-' . esc_attr( $field ) . '" name="lakehub_social_' . esc_attr( $field ) . '" value="' . esc_attr( $value ) . '">';
		}
		echo '</td></tr>';
	}
	echo '</table>';
	submit_button();
	echo '</form></div>';
}

/**
 * Copy a bundled image into the Media Library exactly once.
 *
 * @param string $filename Asset filename.
 * @return int Attachment ID or zero.
 */
function lakehub_social_import_theme_image( $filename ) {
	$path = get_theme_file_path( 'assets/images/' . $filename );
	if ( ! file_exists( $path ) ) { return 0; }
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	$contents = file_get_contents( $path );
	if ( false === $contents ) { return 0; }
	$file = wp_upload_bits( basename( $path ), null, $contents );
	if ( ! empty( $file['error'] ) ) { return 0; }
	$type = wp_check_filetype( $file['file'] );
	$id = wp_insert_attachment( array( 'post_mime_type' => $type['type'], 'post_title' => sanitize_text_field( pathinfo( $filename, PATHINFO_FILENAME ) ), 'post_status' => 'inherit' ), $file['file'] );
	if ( is_wp_error( $id ) ) { return 0; }
	wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $file['file'] ) );
	return (int) $id;
}

/**
 * Determine whether an ID is a reusable, non-trashed page.
 *
 * @param int $page_id Potential page ID.
 * @return WP_Post|null
 */
function lakehub_social_get_valid_homepage( $page_id ) {
	$page = get_post( absint( $page_id ) );
	if ( ! $page || 'page' !== $page->post_type || 'trash' === $page->post_status ) {
		return null;
	}
	return $page;
}

/**
 * Find an existing homepage or create the real Home page.
 *
 * @return int|WP_Error
 */
function lakehub_social_resolve_homepage() {
	$candidates = array(
		absint( get_option( 'lakehub_social_homepage_id' ) ),
		absint( get_option( 'page_on_front' ) ),
	);

	foreach ( $candidates as $candidate ) {
		$page = lakehub_social_get_valid_homepage( $candidate );
		if ( $page ) {
			return (int) $page->ID;
		}
	}

	$home = get_page_by_path( 'home', OBJECT, 'page' );
	if ( $home && 'trash' !== $home->post_status ) {
		return (int) $home->ID;
	}

	return wp_insert_post(
		array(
			'post_title'   => __( 'Home', 'lakehub-social' ),
			'post_name'    => 'home',
			'post_content' => '',
			'post_status'  => 'publish',
			'post_type'    => 'page',
		),
		true
	);
}

/**
 * Import missing bundled images and reuse every valid existing attachment.
 *
 * @return array<string, int>
 */
function lakehub_social_ensure_theme_media() {
	$files = array(
		'logo'           => 'figma-b858.png',
		'hero'           => 'figma-2691.png',
		'about'          => 'figma-354f.jpg',
		'work'           => 'figma-work.jpg',
		'giz'            => 'partner-giz.png',
		'pfe'            => 'partner-pfe.png',
		'insight_zone01' => 'insight-zone01.png',
		'insight_gender' => 'insight-gender.jpg',
		'insight_italanta' => 'insight-italanta.jpg',
	);
	$ids = get_option( 'lakehub_social_asset_attachment_ids', array() );
	$ids = is_array( $ids ) ? $ids : array();

	foreach ( $files as $key => $file ) {
		$attachment_id = isset( $ids[ $key ] ) ? absint( $ids[ $key ] ) : 0;
		if ( ! $attachment_id || 'attachment' !== get_post_type( $attachment_id ) || ! wp_attachment_is_image( $attachment_id ) ) {
			$attachment_id = lakehub_social_import_theme_image( $file );
		}
		$ids[ $key ] = $attachment_id;
	}

	update_option( 'lakehub_social_asset_attachment_ids', $ids, false );
	return array_map( 'absint', $ids );
}

/**
 * Seed only missing homepage sections and never overwrite editor data.
 *
 * @param int                $page_id Homepage ID.
 * @param array<string, int> $ids     Imported asset IDs.
 */
function lakehub_social_seed_homepage_content( $page_id, $ids ) {
	$defaults = lakehub_social_homepage_defaults();
	$defaults['hero']['image_id'] = isset( $ids['hero'] ) ? $ids['hero'] : 0;
	$defaults['mission']['about_image_id'] = isset( $ids['about'] ) ? $ids['about'] : 0;
	$defaults['mission']['work_image_id'] = isset( $ids['work'] ) ? $ids['work'] : 0;
	$defaults['partners']['items'][0]['logo_id'] = isset( $ids['giz'] ) ? $ids['giz'] : 0;
	$defaults['partners']['items'][2]['logo_id'] = isset( $ids['pfe'] ) ? $ids['pfe'] : 0;

	foreach ( $defaults as $section => $content ) {
		$meta_key = '_lakehub_' . $section;
		if ( ! metadata_exists( 'post', $page_id, $meta_key ) ) {
			update_post_meta( $page_id, $meta_key, $content );
		}
	}
}

/**
 * Create, assign, and seed the editable WordPress homepage exactly once.
 *
 * @return int|WP_Error
 */
function lakehub_social_setup_homepage() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return new WP_Error( 'lakehub_homepage_forbidden', __( 'You do not have permission to configure the homepage.', 'lakehub-social' ) );
	}

	$page_id = lakehub_social_resolve_homepage();
	if ( is_wp_error( $page_id ) ) {
		return $page_id;
	}

	$page = lakehub_social_get_valid_homepage( $page_id );
	if ( ! $page ) {
		return new WP_Error( 'lakehub_homepage_invalid', __( 'The homepage could not be created.', 'lakehub-social' ) );
	}

	if ( 'publish' !== $page->post_status ) {
		$published = wp_update_post( array( 'ID' => $page_id, 'post_status' => 'publish' ), true );
		if ( is_wp_error( $published ) ) {
			return $published;
		}
	}

	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', $page_id );
	update_option( 'lakehub_social_homepage_id', $page_id, false );

	$ids = lakehub_social_ensure_theme_media();
	lakehub_social_seed_homepage_content( $page_id, $ids );

	if ( ! get_theme_mod( 'custom_logo' ) && $ids['logo'] ) {
		set_theme_mod( 'custom_logo', $ids['logo'] );
	}

	update_option( 'lakehub_social_content_version', '1.2.0', false );
	if ( get_current_user_id() ) {
		update_user_meta( get_current_user_id(), '_lakehub_homepage_setup_notice', $page_id );
	}

	return $page_id;
}
add_action( 'after_switch_theme', 'lakehub_social_setup_homepage' );

/** Run the corrected setup for themes that were already active before 1.2.0. */
function lakehub_social_maybe_setup_homepage() {
	if ( '1.2.0' === get_option( 'lakehub_social_content_version' ) ) {
		$front_page = lakehub_social_get_valid_homepage( get_option( 'page_on_front' ) );
		if ( $front_page && 'publish' === $front_page->post_status && 'page' === get_option( 'show_on_front' ) ) {
			if ( (int) get_option( 'lakehub_social_homepage_id' ) !== (int) $front_page->ID ) {
				update_option( 'lakehub_social_homepage_id', $front_page->ID, false );
			}
			return;
		}
	}
	lakehub_social_setup_homepage();
}
add_action( 'admin_init', 'lakehub_social_maybe_setup_homepage', 20 );

/** Show one successful setup notice to the administrator who ran it. */
function lakehub_social_homepage_setup_notice() {
	$user_id = get_current_user_id();
	$page_id = absint( get_user_meta( $user_id, '_lakehub_homepage_setup_notice', true ) );
	$page    = lakehub_social_get_valid_homepage( $page_id );
	if ( ! $page ) {
		return;
	}

	delete_user_meta( $user_id, '_lakehub_homepage_setup_notice' );
	$edit_url = get_edit_post_link( $page_id, '' );
	$view_url = get_permalink( $page_id );
	?>
	<div class="notice notice-success is-dismissible">
		<p><strong><?php esc_html_e( 'The editable Home page is ready.', 'lakehub-social' ); ?></strong></p>
		<p>
			<a class="button button-primary" href="<?php echo esc_url( $edit_url ); ?>"><?php esc_html_e( 'Edit Home Page', 'lakehub-social' ); ?></a>
			<a class="button" href="<?php echo esc_url( $view_url ); ?>"><?php esc_html_e( 'View Home Page', 'lakehub-social' ); ?></a>
		</p>
	</div>
	<?php
}
add_action( 'admin_notices', 'lakehub_social_homepage_setup_notice' );

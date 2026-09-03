<?php
/** Program content type and editor behavior. @package LakeHub_Social */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/** Register editor-managed Programs without exposing detail routes yet. */
function lakehub_social_register_program_type() {
	register_post_type(
		'program',
		array(
			'labels' => array(
				'name'          => __( 'Programs', 'lakehub-social' ),
				'singular_name' => __( 'Program', 'lakehub-social' ),
				'add_new_item'  => __( 'Add New Program', 'lakehub-social' ),
				'edit_item'     => __( 'Edit Program', 'lakehub-social' ),
			),
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'show_in_rest'       => true,
			'has_archive'        => false,
			'rewrite'            => false,
			'query_var'          => false,
			'menu_icon'          => 'dashicons-screenoptions',
			'supports'           => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes' ),
		)
	);

	register_post_meta(
		'program',
		'_lakehub_program_url',
		array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'esc_url_raw',
			'auth_callback'     => static function () { return current_user_can( 'edit_posts' ); },
		)
	);
	register_post_meta( 'program', '_lakehub_program_image', array( 'type' => 'string', 'single' => true, 'show_in_rest' => false, 'sanitize_callback' => 'sanitize_file_name' ) );
}
add_action( 'init', 'lakehub_social_register_program_type' );

/** Add the optional destination control. */
function lakehub_social_add_program_meta_box() {
	add_meta_box( 'lakehub-program-options', __( 'Program card options', 'lakehub-social' ), 'lakehub_social_render_program_meta_box', 'program', 'side', 'default' );
}
add_action( 'add_meta_boxes_program', 'lakehub_social_add_program_meta_box' );

function lakehub_social_render_program_meta_box( $post ) {
	wp_nonce_field( 'lakehub_social_save_program', 'lakehub_social_program_nonce' );
	$url = get_post_meta( $post->ID, '_lakehub_program_url', true );
	echo '<p><label for="lakehub-program-url"><strong>' . esc_html__( 'Learn More URL', 'lakehub-social' ) . '</strong></label></p><input class="widefat" type="url" id="lakehub-program-url" name="lakehub_program_url" value="' . esc_attr( $url ) . '" placeholder="https://"><p class="description">' . esc_html__( 'Leave empty to display the label without a link until detail pages are available.', 'lakehub-social' ) . '</p>';
}

function lakehub_social_save_program( $post_id ) {
	if ( ! isset( $_POST['lakehub_social_program_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['lakehub_social_program_nonce'] ) ), 'lakehub_social_save_program' ) || ! current_user_can( 'edit_post', $post_id ) || wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) { return; }
	$url = isset( $_POST['lakehub_program_url'] ) ? esc_url_raw( wp_unslash( $_POST['lakehub_program_url'] ) ) : '';
	if ( $url ) { update_post_meta( $post_id, '_lakehub_program_url', $url ); } else { delete_post_meta( $post_id, '_lakehub_program_url' ); }
}
add_action( 'save_post_program', 'lakehub_social_save_program' );

/** Return the card image, preferring an editor-selected featured image. */
function lakehub_social_program_image( $post_id ) {
	if ( has_post_thumbnail( $post_id ) ) {
		return get_the_post_thumbnail( $post_id, 'full', array( 'loading' => 'lazy' ) );
	}
	$fallback = sanitize_file_name( (string) get_post_meta( $post_id, '_lakehub_program_image', true ) );
	return $fallback ? lakehub_social_image( 0, 'programs/' . $fallback, get_the_title( $post_id ), array( 'loading' => 'lazy' ) ) : '';
}

/** Exact initial Program content from the supplied Figma frame. */
function lakehub_social_default_programs() {
	return array(
		array(
			'title' => 'FemiDevs',
			'image' => 'femidevs.jpg',
			'text'  => 'The FemiDevs program promotes women in tech through scholarships, mentorship, and creative problem-solving. Our approach empowers both non-programmers and programmers to create softwares without extensive coding. 75% of girls experience positive attitude shifts towards tech, and 64% of new learners gain confidence in pursuing careers in tech. We believe in technology as an enabler, not a barrier.',
		),
		array(
			'title' => 'Opportunities for Youth in Africa',
			'image' => 'youth-africa.jpg',
			'text'  => 'The Engendering Mentorship (e-GEM) program supports female students facing challenges leading to high dropout rates. By providing a supportive university environment, e-GEM aims to reduce dropouts. The program also boosts students’ confidence in pursuing careers in technology, innovation design, and business.',
		),
		array(
			'title' => 'Alumni Network',
			'image' => 'alumni-network.jpg',
			'text'  => 'Reducing youth unemployment is the most important factor in building strong economic pillars. Our alumni community now spans in more than 5 counties with more than 1500 youths gaining relevant technology training and entrepreneurial skills as well as job placement in the last 3 years.',
		),
		array(
			'title' => 'Issue-Based Collaborative Network (ICON)',
			'image' => 'icon.jpg',
			'text'  => 'The Research-to-Change leadership program empowers young leaders to influence policy through research and data-driven approaches. ICON fosters intergenerational learning and dialogue for informed decision-making at various development levels. The program promotes concrete actions, cooperation, and the adoption of R2C principles across sectors for improved work, policy formulation, and decision-making.',
		),
	);
}

/** Idempotently create the Programs page and initial editable cards. */
function lakehub_social_seed_program_content() {
	if ( get_option( 'lakehub_social_program_seeded' ) ) { return; }
	$page = get_page_by_path( 'programs', OBJECT, 'page' );
	if ( ! $page ) {
		$page_id = wp_insert_post( array( 'post_title' => 'Programs', 'post_name' => 'programs', 'post_status' => 'publish', 'post_type' => 'page' ) );
		if ( $page_id && ! is_wp_error( $page_id ) ) { update_post_meta( $page_id, '_wp_page_template', 'page-programs.php' ); }
	} else {
		update_post_meta( $page->ID, '_wp_page_template', 'page-programs.php' );
	}

	$existing = get_posts( array( 'post_type' => 'program', 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids' ) );
	if ( ! $existing ) {
		foreach ( lakehub_social_default_programs() as $order => $program ) {
			$post_id = wp_insert_post( array( 'post_type' => 'program', 'post_status' => 'publish', 'post_title' => $program['title'], 'post_content' => $program['text'], 'post_excerpt' => $program['text'], 'menu_order' => $order ) );
			if ( $post_id && ! is_wp_error( $post_id ) ) { update_post_meta( $post_id, '_lakehub_program_image', $program['image'] ); }
		}
	}
	update_option( 'lakehub_social_program_seeded', 1, false );
}
add_action( 'after_switch_theme', 'lakehub_social_seed_program_content' );

/** Seed an already-active theme on the next administrator request. */
function lakehub_social_maybe_seed_program_content() {
	if ( current_user_can( 'manage_options' ) ) { lakehub_social_seed_program_content(); }
}
add_action( 'admin_init', 'lakehub_social_maybe_seed_program_content' );

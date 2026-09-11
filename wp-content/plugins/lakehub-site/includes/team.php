<?php
/** Shared team records and optional page actions. @package LakeHub_Site */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'init', static function () {
	register_post_type( 'lakehub_team_member', array(
		'labels' => array( 'name' => __( 'Team Members', 'lakehub-site' ), 'singular_name' => __( 'Team Member', 'lakehub-site' ), 'add_new_item' => __( 'Add Team Member', 'lakehub-site' ) ),
		'public' => false, 'publicly_queryable' => false, 'show_ui' => true, 'show_in_rest' => true,
		'rewrite' => false, 'query_var' => false, 'has_archive' => false, 'menu_icon' => 'dashicons-groups',
		'supports' => array( 'title', 'editor', 'thumbnail', 'page-attributes', 'custom-fields', 'revisions' ),
		'template' => array( array( 'core/paragraph', array( 'placeholder' => __( 'Write a short biography.', 'lakehub-site' ) ) ) ),
	) );
	foreach ( array( '_lakehub_team_role' => 'string', '_lakehub_team_featured' => 'boolean' ) as $key => $type ) {
		register_post_meta( 'lakehub_team_member', $key, array(
			'type' => $type, 'single' => true, 'show_in_rest' => true,
			'sanitize_callback' => 'boolean' === $type ? 'rest_sanitize_boolean' : 'sanitize_text_field',
			'auth_callback' => static function ( $allowed, $meta_key, $id ) { return current_user_can( 'edit_post', $id ); },
		) );
	}
	register_block_type( dirname( __DIR__ ) . '/blocks/team' );
} );

add_action( 'add_meta_boxes_lakehub_team_member', static function () {
	add_meta_box( 'lakehub-team-options', __( 'Team card options', 'lakehub-site' ), static function ( $post ) {
		wp_nonce_field( 'lakehub_save_team', 'lakehub_team_nonce' );
		?><p><label for="lakehub-team-role"><?php esc_html_e( 'Role', 'lakehub-site' ); ?></label>
		<input class="widefat" id="lakehub-team-role" name="lakehub_team_role" value="<?php echo esc_attr( get_post_meta( $post->ID, '_lakehub_team_role', true ) ); ?>"></p>
		<p><label><input type="checkbox" name="lakehub_team_featured" value="1" <?php checked( get_post_meta( $post->ID, '_lakehub_team_featured', true ) ); ?>> <?php esc_html_e( 'Featured on About', 'lakehub-site' ); ?></label></p>
		<p><?php esc_html_e( 'Set the portrait using Featured image. Use Order under Page Attributes to arrange cards; lower numbers appear first.', 'lakehub-site' ); ?></p><?php
	}, 'lakehub_team_member', 'side' );
} );

add_action( 'save_post_lakehub_team_member', static function ( $id ) {
	if ( ! isset( $_POST['lakehub_team_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['lakehub_team_nonce'] ) ), 'lakehub_save_team' ) || ! current_user_can( 'edit_post', $id ) || wp_is_post_autosave( $id ) || wp_is_post_revision( $id ) ) { return; }
	update_post_meta( $id, '_lakehub_team_role', sanitize_text_field( wp_unslash( $_POST['lakehub_team_role'] ?? '' ) ) );
	update_post_meta( $id, '_lakehub_team_featured', ! empty( $_POST['lakehub_team_featured'] ) );
} );

// Optional native Button blocks remain editable but are only rendered once a URL exists.
add_filter( 'render_block_core/button', static function ( $html, $block ) {
	if ( ! str_contains( $block['attrs']['className'] ?? '', 'is-style-lakehub-optional-action' ) ) { return $html; }
	$tags = new WP_HTML_Tag_Processor( $html );
	return $tags->next_tag( 'A' ) && trim( (string) $tags->get_attribute( 'href' ) ) ? $html : '';
}, 10, 2 );

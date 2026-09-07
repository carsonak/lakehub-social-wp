<?php
/** Programs persist independently of the theme. @package LakeHub_Site */
if ( ! defined( 'ABSPATH' ) ) { exit; }

add_action( 'init', static function () {
	register_post_type( 'program', array(
		'labels' => array( 'name' => __( 'Programs', 'lakehub-site' ), 'singular_name' => __( 'Program', 'lakehub-site' ), 'add_new_item' => __( 'Add New Program', 'lakehub-site' ), 'edit_item' => __( 'Edit Program', 'lakehub-site' ) ),
		'public' => false, 'publicly_queryable' => false, 'show_ui' => true, 'show_in_menu' => true, 'show_in_rest' => true,
		'has_archive' => false, 'rewrite' => false, 'query_var' => false, 'menu_icon' => 'dashicons-screenoptions',
		'supports' => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'custom-fields', 'revisions' ),
		'template' => array( array( 'core/paragraph', array( 'placeholder' => __( 'Describe this program. This text appears on the Programs page.', 'lakehub-site' ) ) ) ),
	) );
	register_post_meta( 'program', '_lakehub_program_url', array(
		'type' => 'string', 'single' => true, 'show_in_rest' => true, 'sanitize_callback' => 'esc_url_raw',
		'auth_callback' => static function ( $allowed, $key, $post_id ) { return current_user_can( 'edit_post', $post_id ); },
	) );
	register_post_meta( 'program', '_lakehub_program_image', array( 'type' => 'string', 'single' => true, 'show_in_rest' => false, 'sanitize_callback' => 'sanitize_file_name' ) );
	register_block_type( dirname( __DIR__ ) . '/blocks/programs' );
} );

add_action( 'add_meta_boxes_program', static function () {
	add_meta_box( 'lakehub-program-options', __( 'Program card options', 'lakehub-site' ), static function ( $post ) {
		wp_nonce_field( 'lakehub_save_program', 'lakehub_program_nonce' );
		?><p><label for="lakehub-program-url"><?php esc_html_e( 'Learn More URL', 'lakehub-site' ); ?></label></p>
		<input class="widefat" type="url" id="lakehub-program-url" name="lakehub_program_url" value="<?php echo esc_attr( get_post_meta( $post->ID, '_lakehub_program_url', true ) ); ?>">
		<p class="description"><?php esc_html_e( 'Leave blank to show the label without a link. Use the block editor for the description and Featured image for the photo.', 'lakehub-site' ); ?></p>
		<p><label for="lakehub-program-order"><?php esc_html_e( 'Display order (lower numbers first)', 'lakehub-site' ); ?></label></p>
		<input type="number" id="lakehub-program-order" name="lakehub_program_order" value="<?php echo esc_attr( $post->menu_order ); ?>">
		<?php
	}, 'program', 'side' );
} );

add_action( 'save_post_program', static function ( $post_id ) {
	if ( ! isset( $_POST['lakehub_program_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['lakehub_program_nonce'] ) ), 'lakehub_save_program' ) || ! current_user_can( 'edit_post', $post_id ) || wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) { return; }
	update_post_meta( $post_id, '_lakehub_program_url', isset( $_POST['lakehub_program_url'] ) ? esc_url_raw( wp_unslash( $_POST['lakehub_program_url'] ) ) : '' );
} );

add_filter( 'wp_insert_post_data', static function ( $data, $postarr ) {
	if ( 'program' === $data['post_type'] && isset( $_POST['lakehub_program_nonce'], $_POST['lakehub_program_order'], $postarr['ID'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['lakehub_program_nonce'] ) ), 'lakehub_save_program' ) && current_user_can( 'edit_post', $postarr['ID'] ) ) {
		$data['menu_order'] = (int) $_POST['lakehub_program_order'];
	}
	return $data;
}, 10, 2 );

<?php
/** Explicit refresh of the approved design, independent of the original migration. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class LakeHub_Design_Refresh extends LakeHub_Block_Migration {
	const REFRESH_MARKER = 'lakehub_design_refresh_version';
	const REFRESH_SNAPSHOT = 'lakehub_design_refresh_snapshot_v1';

	/**
	 * Apply the approved exported designs to the existing development content.
	 *
	 * ## OPTIONS
	 * [--dry-run]
	 * : Validate sources and targets without writing.
	 */
	public function refresh( $args, $assoc_args ) {
		$this->check_target();
		if ( get_option( self::REFRESH_MARKER ) ) {
			WP_CLI::success( 'Design refresh already complete; editor changes were left untouched.' );
			return;
		}
		$home = get_post( (int) get_option( 'page_on_front' ) );
		$programs = get_page_by_path( 'programs', OBJECT, 'page' );
		if ( ! $home || 'page' !== $home->post_type || ! $programs ) { WP_CLI::error( 'Expected existing Home and Programs pages.' ); }
		$home_content = '';
		foreach ( array( 'home-hero', 'home-impact', 'home-journey', 'home-partners', 'home-insights', 'home-cta' ) as $slug ) {
			$home_content .= $this->pattern( $slug ) . "\n\n";
		}
		$updates = array(
			array( 'ID' => $home->ID, 'post_content' => $home_content ),
			array( 'ID' => $programs->ID, 'post_content' => $this->pattern( 'programs-hero' ) . "\n\n" . $this->pattern( 'programs-list' ) ),
		);
		foreach ( lakehub_site_default_programs() as $order => $default ) {
			$post = get_page_by_path( sanitize_title( $default['title'] ), OBJECT, 'program' );
			if ( ! $post ) { WP_CLI::error( 'Missing expected program: ' . $default['title'] ); }
			$updates[] = array( 'ID' => $post->ID, 'post_title' => $default['title'], 'post_content' => '<!-- wp:paragraph --><p>' . esc_html( $default['text'] ) . '</p><!-- /wp:paragraph -->', 'post_excerpt' => $default['text'], 'menu_order' => $order );
		}
		foreach ( array( 'home-hero.jpg', 'programs-hero.jpg', 'engineers.jpg', 'partners.jpg', 'placement.jpg', 'startups.jpg', 'zone01-mark.svg' ) as $file ) {
			$path = get_theme_file_path( 'assets/images/refresh/' . $file );
			if ( ! is_file( $path ) || ! filesize( $path ) ) { WP_CLI::error( 'Missing refresh asset: ' . $file ); }
		}
		WP_CLI::log( sprintf( 'Local target: %s (%s). Home #%d; Programs #%d; four program descriptions.', home_url(), ABSPATH, $home->ID, $programs->ID ) );
		if ( isset( $assoc_args['dry-run'] ) ) {
			WP_CLI::success( 'Would snapshot affected fields, import refresh photos, and replace development page content. Program URLs, thumbnails, article bodies, and unrelated content remain untouched.' );
			return;
		}
		if ( ! get_option( self::REFRESH_SNAPSHOT ) ) {
			$snapshot = array();
			foreach ( $updates as $update ) {
				$post = get_post( $update['ID'], ARRAY_A );
				$snapshot[ $post['ID'] ] = array(
					'post' => array_intersect_key( $post, $update ),
					'template' => get_post_meta( $post['ID'], '_wp_page_template', false ),
				);
			}
			if ( ! add_option( self::REFRESH_SNAPSHOT, $snapshot, '', false ) ) { WP_CLI::error( 'Could not save refresh rollback snapshot.' ); }
		}
		$this->media = get_option( 'lakehub_block_media', array() );
		foreach ( $updates as $update ) {
			if ( 'page' === get_post_type( $update['ID'] ) ) { $update['post_content'] = $this->with_media( $update['post_content'] ); }
			$this->update( $update );
		}
		update_post_meta( $home->ID, '_wp_page_template', 'default' );
		update_post_meta( $programs->ID, '_wp_page_template', 'programs' );
		update_option( self::REFRESH_MARKER, 1, false );
		WP_CLI::success( 'Approved design refresh applied. The original migration snapshot is unchanged.' );
	}

	/** Restore refresh-owned fields. Take a new backup before using after client editing. */
	public function rollback() {
		$this->check_target();
		$snapshot = get_option( self::REFRESH_SNAPSHOT );
		if ( ! $snapshot ) { WP_CLI::error( 'No design refresh snapshot exists.' ); }
		foreach ( $snapshot as $id => $entry ) {
			if ( ! get_post( $id ) ) { WP_CLI::error( 'Snapshot target no longer exists: ' . $id ); }
		}
		foreach ( $snapshot as $id => $entry ) {
			$this->update( $entry['post'] );
			if ( 'page' === get_post_type( $id ) ) {
				delete_post_meta( $id, '_wp_page_template' );
				foreach ( $entry['template'] as $value ) { add_post_meta( $id, '_wp_page_template', $value ); }
			}
		}
		delete_option( self::REFRESH_MARKER );
		WP_CLI::success( 'Pre-refresh content restored. Restore matching theme source for the previous appearance. Imported media and snapshot retained.' );
	}

	private function check_target() {
		if ( 'local' !== wp_get_environment_type() || is_multisite() || 'lakehub-social' !== get_stylesheet() || ! wp_is_block_theme() ) {
			WP_CLI::error( 'Expected the local, single-site LakeHub block theme.' );
		}
	}
}
// Register only the refresh operations, not inherited original-migration commands.
$lakehub_design_refresh = new LakeHub_Design_Refresh();
WP_CLI::add_command( 'lakehub design refresh', array( $lakehub_design_refresh, 'refresh' ) );
WP_CLI::add_command( 'lakehub design rollback', array( $lakehub_design_refresh, 'rollback' ) );

<?php
/** Explicit September completion with an independent rollback journal. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class LakeHub_Completion_20260910 extends LakeHub_Block_Migration {
	const JOURNAL = 'lakehub_completion_20260910_snapshot';
	const DONE = 'lakehub_completion_20260910_done';
	private $journal = array();

	private function target() {
		if ( 'local' !== wp_get_environment_type() || is_multisite() || 'lakehub-social' !== get_stylesheet() || ! wp_is_block_theme() ) { WP_CLI::error( 'Expected the local single-site LakeHub theme.' ); }
	}

	/** Complete the approved pages.
	 *
	 * ## OPTIONS
	 * [--dry-run]
	 * : Report target and planned writes only.
	 */
	public function apply( $args, $assoc_args ) {
		$this->target();
		if ( get_option( self::DONE ) ) { WP_CLI::success( 'Completion already applied; editor changes preserved.' ); return; }
		if ( get_option( self::JOURNAL ) ) { WP_CLI::error( 'An incomplete run exists. Back up and run rollback before retrying.' ); }
		$home = get_post( (int) get_option( 'page_on_front' ) );
		if ( ! $home || 'page' !== $home->post_type ) { WP_CLI::error( 'Missing Home page.' ); }
		foreach ( array( 'about', 'impact', 'team' ) as $slug ) {
			if ( get_page_by_path( $slug, OBJECT, 'page' ) ) { WP_CLI::error( 'Page already exists; refusing to replace: ' . $slug ); }
			$this->pattern( $slug . '-page' );
		}
		$defaults = json_decode( file_get_contents( __DIR__ . '/team-defaults.json' ), true );
		foreach ( $defaults as $member ) {
			if ( get_page_by_path( sanitize_title( $member['name'] ), OBJECT, 'lakehub_team_member' ) ) { WP_CLI::error( 'Team member already exists: ' . $member['name'] ); }
			if ( ! is_file( get_theme_file_path( 'assets/images/completion/' . $member['image'] ) ) ) { WP_CLI::error( 'Missing portrait.' ); }
		}
		$home_content = $this->patch_home( $home->post_content );
		WP_CLI::log( sprintf( 'Local target: %s (%s). Patch Home #%d hero and Insights limit; create About, Impact, Team and twelve team records.', home_url(), ABSPATH, $home->ID ) );
		if ( isset( $assoc_args['dry-run'] ) ) { WP_CLI::success( 'Dry run complete. No writes.' ); return; }
		$this->journal = array( 'before' => array( $home->ID => $home->post_content ), 'created' => array(), 'after' => array() );
		if ( ! add_option( self::JOURNAL, $this->journal, '', false ) ) { WP_CLI::error( 'Could not create the recovery journal.' ); }
		// This local site's tables are InnoDB. Commit the related content changes together.
		global $wpdb;
		if ( false === $wpdb->query( 'START TRANSACTION' ) ) { WP_CLI::error( 'Could not begin content transaction.' ); }
		$this->media = get_option( 'lakehub_block_media', array() );
		foreach ( $defaults as $order => $member ) {
			$id = $this->create( array( 'post_type' => 'lakehub_team_member', 'post_title' => $member['name'], 'post_name' => sanitize_title( $member['name'] ), 'post_status' => 'publish', 'menu_order' => $order, 'post_content' => $member['bio'] ? '<!-- wp:paragraph --><p>' . esc_html( $member['bio'] ) . '</p><!-- /wp:paragraph -->' : '' ) );
			update_post_meta( $id, '_lakehub_team_role', $member['role'] );
			update_post_meta( $id, '_lakehub_team_featured', $member['featured'] );
			$portrait = $this->image( 'images/completion/' . $member['image'], $member['name'] );
			set_post_thumbnail( $id, $portrait );
			update_post_meta( $id, '_lakehub_team_crop', $member['crop'] );
			update_post_meta( $id, '_lakehub_team_source_image', $portrait );
		}
		foreach ( array( 'about', 'impact', 'team' ) as $slug ) {
			$id = $this->create( array( 'post_type' => 'page', 'post_title' => ucfirst( $slug ), 'post_name' => $slug, 'post_status' => 'publish', 'post_content' => $this->with_media( $this->pattern( $slug . '-page' ) ) ) );
			update_post_meta( $id, '_wp_page_template', $slug );
		}
		$result = wp_update_post( wp_slash( array( 'ID' => $home->ID, 'post_content' => $home_content ) ), true );
		if ( is_wp_error( $result ) ) { WP_CLI::error( $result->get_error_message() ); }
		$this->journal['after'][ $home->ID ] = hash( 'sha256', $home_content );
		// Only update the site's referenced menus, and only the known design destinations.
		foreach ( array_unique( array_values( get_option( 'lakehub_block_navigation', array() ) ) ) as $id ) {
			$post = get_post( $id );
			if ( ! $post || 'wp_navigation' !== $post->post_type ) { continue; }
			$content = serialize_blocks( $this->patch_navigation( parse_blocks( $post->post_content ) ) );
			if ( $content === $post->post_content ) { continue; }
			$this->journal['before'][ $id ] = $post->post_content;
			$this->save_journal();
			$result = wp_update_post( wp_slash( array( 'ID' => $id, 'post_content' => $content ) ), true );
			if ( is_wp_error( $result ) ) { WP_CLI::error( $result->get_error_message() ); }
			$this->journal['after'][ $id ] = hash( 'sha256', $content );
		}
		foreach ( $this->journal['created'] as $id ) { $this->journal['after'][ $id ] = $this->fingerprint( $id ); }
		$this->save_journal();
		update_option( self::DONE, 1, false );
		if ( false === $wpdb->query( 'COMMIT' ) ) { WP_CLI::error( 'Content transaction could not be committed.' ); }
		WP_CLI::success( 'Completion applied. Existing IDs, Programs and unrelated content preserved.' );
	}

	private function patch_home( $content ) {
		$found = array( 'hero' => 0, 'query' => 0 );
		$walk = function ( $blocks ) use ( &$walk, &$found ) {
			foreach ( $blocks as &$block ) {
				$class = $block['attrs']['className'] ?? '';
				if ( 'core/cover' === $block['blockName'] && str_contains( $class, 'is-style-lakehub-home-photo' ) ) {
					++$found['hero'];
					$block['attrs']['dimRatio'] = 60;
					foreach ( $block['innerContent'] as &$chunk ) {
						if ( ! is_string( $chunk ) ) { continue; }
						$tags = new WP_HTML_Tag_Processor( $chunk );
						while ( $tags->next_tag( array( 'class_name' => 'wp-block-cover__background' ) ) ) {
							foreach ( range( 0, 100, 10 ) as $dim ) { $tags->remove_class( 'has-background-dim-' . $dim ); }
							$tags->add_class( 'has-background-dim-60' );
						}
						$chunk = $tags->get_updated_html();
					}
					unset( $chunk );
					$replace = function ( &$children ) use ( &$replace ) {
						foreach ( $children as &$child ) {
							if ( 'core/heading' === $child['blockName'] ) {
								foreach ( $child['innerContent'] as &$html ) { if ( is_string( $html ) ) { $html = str_replace( 'has-teal-color', 'has-aqua-color', $html ); } }
								unset( $html );
							}
							$replace( $child['innerBlocks'] );
						}
					};
					$replace( $block['innerBlocks'] );
				}
				if ( 'core/query' === $block['blockName'] && str_contains( $class, 'is-style-lakehub-insights' ) ) { ++$found['query']; $block['attrs']['query']['perPage'] = 12; $sample = get_post( 1 ); if ( $sample && 'hello-world' === $sample->post_name && 'Hello world!' === $sample->post_title ) { $block['attrs']['query']['exclude'] = array_values( array_unique( array_merge( $block['attrs']['query']['exclude'] ?? array(), array( 1 ) ) ) ); } }
				$block['innerBlocks'] = $walk( $block['innerBlocks'] );
			}
			return $blocks;
		};
		$result = serialize_blocks( $walk( parse_blocks( $content ) ) );
		if ( 1 !== $found['hero'] || 1 !== $found['query'] ) { WP_CLI::error( 'Expected one Home hero and one Insights query; refusing ambiguous edits.' ); }
		return $result;
	}

	private function patch_navigation( $blocks ) {
		$targets = array( 'about' => '/about/', 'about us' => '/about/', 'impact' => '/impact/', 'impact stories' => '/impact/', 'our mission' => '/about/#mission', 'history' => '/about/#history' );
		foreach ( $blocks as &$block ) {
			$label = strtolower( trim( wp_strip_all_tags( $block['attrs']['label'] ?? '' ) ) );
			if ( 'core/navigation-link' === $block['blockName'] && isset( $targets[ $label ] ) ) { $block['attrs']['url'] = home_url( $targets[ $label ] ); $block['attrs']['kind'] = 'custom'; unset( $block['attrs']['id'], $block['attrs']['type'] ); }
			$block['innerBlocks'] = $this->patch_navigation( $block['innerBlocks'] );
		}
		return $blocks;
	}

	private function create( $post ) {
		$id = wp_insert_post( wp_slash( $post ), true );
		if ( is_wp_error( $id ) ) { WP_CLI::error( $id->get_error_message() ); }
		$this->journal['created'][] = $id;
		$this->save_journal();
		return $id;
	}

	/** Preserve original images on minimal local PHP builds lacking XML/image extensions. */
	protected function image( $asset, $alt ) {
		if ( class_exists( 'DOMDocument' ) ) { return parent::image( $asset, $alt ); }
		if ( isset( $this->media[ $asset ] ) && wp_attachment_is_image( $this->media[ $asset ] ) ) { return $this->media[ $asset ]; }
		$file = get_theme_file_path( 'assets/' . $asset );
		$size = wp_getimagesize( $file );
		if ( ! $size ) { WP_CLI::error( 'Invalid image: ' . $asset ); }
		$upload = wp_upload_bits( basename( $file ), null, file_get_contents( $file ) );
		if ( $upload['error'] ) { WP_CLI::error( $upload['error'] ); }
		$id = wp_insert_attachment( array( 'post_title' => $alt ?: basename( $file ), 'post_mime_type' => $size['mime'], 'post_status' => 'inherit' ), $upload['file'], 0, true );
		if ( is_wp_error( $id ) ) { WP_CLI::error( $id->get_error_message() ); }
		wp_update_attachment_metadata( $id, array( 'width' => $size[0], 'height' => $size[1], 'file' => _wp_relative_upload_path( $upload['file'] ), 'filesize' => filesize( $upload['file'] ), 'sizes' => array() ) );
		update_post_meta( $id, '_wp_attachment_image_alt', $alt );
		$this->media[ $asset ] = $id;
		update_option( 'lakehub_block_media', $this->media, false );
		return $id;
	}
	private function save_journal() { update_option( self::JOURNAL, $this->journal, false ); }
	private function fingerprint( $id ) {
		$post = get_post( $id, ARRAY_A );
		if ( ! $post ) { return ''; }
		$meta = get_post_meta( $id );
		unset( $meta['_edit_lock'], $meta['_edit_last'] );
		return hash( 'sha256', wp_json_encode( array( $post['post_title'], $post['post_content'], $post['post_status'], $post['menu_order'], $meta ) ) );
	}

	/** Restore completion-owned records; refuses to discard subsequent edits. */
	public function rollback() {
		$this->target();
		$this->journal = get_option( self::JOURNAL );
		if ( ! $this->journal ) { WP_CLI::error( 'No completion snapshot.' ); }
		foreach ( $this->journal['after'] as $id => $hash ) {
			$actual = in_array( $id, $this->journal['created'], true ) ? $this->fingerprint( $id ) : hash( 'sha256', (string) get_post_field( 'post_content', $id ) );
			if ( $actual !== $hash ) { WP_CLI::error( 'Record changed since completion: ' . $id . '. Preserve those edits before recovery.' ); }
		}
		global $wpdb;
		if ( false === $wpdb->query( 'START TRANSACTION' ) ) { WP_CLI::error( 'Could not begin content transaction.' ); }
		foreach ( $this->journal['before'] as $id => $content ) {
			$result = wp_update_post( wp_slash( array( 'ID' => $id, 'post_content' => $content ) ), true );
			if ( is_wp_error( $result ) ) { WP_CLI::error( $result->get_error_message() ); }
		}
		foreach ( array_reverse( $this->journal['created'] ) as $id ) { wp_delete_post( $id, true ); }
		delete_option( self::DONE );
		delete_option( self::JOURNAL );
		if ( false === $wpdb->query( 'COMMIT' ) ) { WP_CLI::error( 'Content transaction could not be committed.' ); }
		WP_CLI::success( 'Completion records restored. Imported media retained for safe reuse.' );
	}
}
$lakehub_completion = new LakeHub_Completion_20260910();
WP_CLI::add_command( 'lakehub completion-20260910 apply', array( $lakehub_completion, 'apply' ) );
WP_CLI::add_command( 'lakehub completion-20260910 rollback', array( $lakehub_completion, 'rollback' ) );

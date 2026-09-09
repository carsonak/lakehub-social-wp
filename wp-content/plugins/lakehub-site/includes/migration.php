<?php
/** Explicit, restartable migration. No writes happen on activation or admin visits. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
require_once __DIR__ . '/defaults.php';

class LakeHub_Block_Migration {
	const VERSION = 1;
	const MARKER = 'lakehub_block_migration_version';
	const SNAPSHOT = 'lakehub_block_migration_snapshot';
	protected $media = array();

	/**
	 * Populate the existing LakeHub pages with native blocks.
	 *
	 * ## OPTIONS
	 * [--dry-run]
	 * : Validate the target and describe changes without writing.
	 */
	public function migrate( $args, $assoc_args ) {
		if ( (int) get_option( self::MARKER ) >= self::VERSION ) {
			WP_CLI::success( 'Migration already complete; editor changes were left untouched.' ); return;
		}
		if ( is_multisite() || 'lakehub-social' !== get_stylesheet() || ! wp_is_block_theme() ) {
			WP_CLI::error( 'Expected the single-site LakeHub block theme. No content changed.' );
		}
		$home = (int) get_option( 'page_on_front' );
		$programs_page = get_page_by_path( 'programs', OBJECT, 'page' );
		if ( ! $home || ! get_post( $home ) || ! $programs_page ) { WP_CLI::error( 'Home or Programs page is missing.' ); }
		$patterns = array( 'home-hero', 'home-impact', 'home-journey', 'home-partners', 'home-insights', 'home-cta', 'programs-hero', 'programs-list' );
		foreach ( $patterns as $slug ) { $this->pattern( $slug ); }
		WP_CLI::log( sprintf( 'Target: %s (%s). Home #%d; Programs #%d.', home_url(), ABSPATH, $home, $programs_page->ID ) );
		if ( isset( $assoc_args['dry-run'] ) ) {
			WP_CLI::success( 'Would import local images, update Figma program/insight defaults, and populate both pages. No writes performed.' ); return;
		}
		$ids = array( $home, $programs_page->ID );
		$programs = array();
		foreach ( lakehub_site_default_programs() as $default ) {
			$post = get_page_by_path( sanitize_title( $default['title'] ), OBJECT, 'program' );
			if ( ! $post ) { WP_CLI::error( 'Expected existing program: ' . $default['title'] ); }
			$programs[] = array( $post, $default ); $ids[] = $post->ID;
		}
		$insights = array(
			'zone01-kisumu-and-nationdev-sign-mou' => array( 'insight-zone01.png', "Bridging Kisumu's tech talent to the global stage through strategic partnerships and continuous skill development." ),
			'closing-the-gender-parity-in-technology' => array( 'insight-gender.png', "LakeHub hosts a 2-day female developers hackathon to mark International Women's Day." ),
			'italanta-hackathon-2024' => array( 'insight-italanta.png', 'Enabling students to fulfill their potential as digital enthusiasts through intense collaborative coding sessions.' ),
		);
		foreach ( $insights as $slug => $data ) {
			$post = get_page_by_path( $slug, OBJECT, 'post' );
			if ( ! $post ) { WP_CLI::error( 'Expected existing insight: ' . $slug ); }
			$ids[] = $post->ID;
		}
		if ( ! get_option( self::SNAPSHOT ) ) {
			$snapshot = array( 'posts' => array(), 'navigation' => get_option( 'lakehub_block_navigation', array() ) );
			foreach ( $ids as $id ) {
				$snapshot['posts'][ $id ] = array( 'post' => get_post( $id, ARRAY_A ), 'meta' => array() );
				foreach ( array( '_wp_page_template', '_thumbnail_id' ) as $key ) {
					$snapshot['posts'][ $id ]['meta'][ $key ] = get_post_meta( $id, $key, false );
				}
			}
			add_option( self::SNAPSHOT, $snapshot, '', false );
		}
		$this->media = get_option( 'lakehub_block_media', array() );
		foreach ( $programs as $order => $entry ) {
			list( $post, $default ) = $entry;
			$this->update( array( 'ID' => $post->ID, 'post_title' => $default['title'], 'post_content' => '<!-- wp:paragraph --><p>' . esc_html( $default['text'] ) . '</p><!-- /wp:paragraph -->', 'post_excerpt' => $default['text'], 'menu_order' => $order ) );
			set_post_thumbnail( $post->ID, $this->image( 'images/programs/' . $default['image'], $default['title'] ) );
		}
		foreach ( $insights as $slug => $data ) {
			$post = get_page_by_path( $slug, OBJECT, 'post' );
			$this->update( array( 'ID' => $post->ID, 'post_excerpt' => $data[1] ) );
			set_post_thumbnail( $post->ID, $this->image( 'images/' . $data[0], $post->post_title ) );
		}
		$home_content = '';
		foreach ( array_slice( $patterns, 0, 6 ) as $slug ) { $home_content .= $this->pattern( $slug ) . "\n\n"; }
		$this->update( array( 'ID' => $home, 'post_content' => $this->with_media( $home_content ) ) );
		$this->update( array( 'ID' => $programs_page->ID, 'post_content' => $this->with_media( $this->pattern( 'programs-hero' ) . "\n\n" . $this->pattern( 'programs-list' ) ) ) );
		update_post_meta( $home, '_wp_page_template', 'default' );
		update_post_meta( $programs_page->ID, '_wp_page_template', 'programs' );
		$this->navigation();
		update_option( self::MARKER, self::VERSION, false );
		WP_CLI::success( 'Block migration complete. Legacy homepage metadata and rollback snapshot retained.' );
	}

	/** Restore only migration-owned fields. Run against a backup/test database when testing. */
	public function rollback() {
		$snapshot = get_option( self::SNAPSHOT );
		if ( ! $snapshot ) { WP_CLI::error( 'No migration snapshot exists.' ); }
		foreach ( $snapshot['posts'] as $id => $entry ) {
			$post = $entry['post'];
			$this->update( array_intersect_key( $post, array_flip( array( 'ID', 'post_title', 'post_content', 'post_excerpt', 'menu_order' ) ) ) );
			foreach ( $entry['meta'] as $key => $values ) {
				delete_post_meta( $id, $key );
				foreach ( $values as $value ) { add_post_meta( $id, $key, $value ); }
			}
		}
		update_option( 'lakehub_block_navigation', $snapshot['navigation'], false );
		delete_option( self::MARKER );
		WP_CLI::success( 'Original page/program fields restored. Imported media and snapshot retained. Restore the matching classic theme source for the original frontend.' );
	}

	protected function update( $post ) {
		// The old PHP template no longer exists; avoid WordPress rejecting an otherwise valid update.
		if ( 'page' === get_post_type( $post['ID'] ) ) {
			$post['page_template'] = 'default';
		}
		$result = wp_update_post( wp_slash( $post ), true );
		if ( is_wp_error( $result ) ) { WP_CLI::error( $result->get_error_message() ); }
	}

	protected function pattern( $slug ) {
		$pattern = WP_Block_Patterns_Registry::get_instance()->get_registered( 'lakehub-social/' . $slug );
		if ( ! $pattern ) { WP_CLI::error( 'Missing pattern: ' . $slug ); }
		return $pattern['content'];
	}

	protected function image( $asset, $alt ) {
		if ( isset( $this->media[ $asset ] ) && wp_attachment_is_image( $this->media[ $asset ] ) ) { return $this->media[ $asset ]; }
		$file = get_theme_file_path( 'assets/' . $asset );
		$mime = wp_get_image_mime( $file );
		if ( ! is_file( $file ) || ! filesize( $file ) || ! $mime ) { WP_CLI::error( 'Missing or invalid local image: ' . $asset ); }
		$name = pathinfo( $file, PATHINFO_FILENAME ) . ( 'image/jpeg' === $mime ? '.jpg' : '.png' );
		$upload = wp_upload_bits( $name, null, file_get_contents( $file ) );
		if ( $upload['error'] ) { WP_CLI::error( $upload['error'] ); }
		$id = wp_insert_attachment( array( 'post_title' => $alt ?: pathinfo( $name, PATHINFO_FILENAME ), 'post_mime_type' => $mime, 'post_status' => 'inherit' ), $upload['file'], 0, true );
		if ( is_wp_error( $id ) ) { WP_CLI::error( $id->get_error_message() ); }
		require_once ABSPATH . 'wp-admin/includes/image.php';
		wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $upload['file'] ) );
		update_post_meta( $id, '_wp_attachment_image_alt', $alt );
		$this->media[ $asset ] = $id;
		update_option( 'lakehub_block_media', $this->media, false );
		return $id;
	}

	protected function with_media( $content ) {
		$base = get_theme_file_uri( 'assets/' );
		$walk = function ( $blocks ) use ( &$walk, $base ) {
			foreach ( $blocks as &$block ) {
				// Native Group backgrounds keep the figure photograph replaceable in the editor.
				$background = $block['attrs']['style']['background']['backgroundImage'] ?? array();
				if ( ! empty( $background['url'] ) && str_starts_with( $background['url'], $base ) ) {
					$id = $this->image( substr( $background['url'], strlen( $base ) ), '' );
					$block['attrs']['style']['background']['backgroundImage'] = array( 'url' => wp_get_attachment_url( $id ), 'id' => $id, 'source' => 'file' );
				}
				if ( in_array( $block['blockName'], array( 'core/image', 'core/cover' ), true ) ) {
					$tags = new WP_HTML_Tag_Processor( $block['innerHTML'] );
					if ( $tags->next_tag( 'IMG' ) ) {
						$src = $tags->get_attribute( 'src' );
						if ( is_string( $src ) && str_starts_with( $src, $base ) && ! str_ends_with( $src, '.svg' ) ) {
							$id = $this->image( substr( $src, strlen( $base ) ), (string) $tags->get_attribute( 'alt' ) );
							$url = wp_get_attachment_url( $id );
							$block['attrs']['id'] = $id;
							if ( 'core/cover' === $block['blockName'] ) { $block['attrs']['url'] = $url; }
							foreach ( $block['innerContent'] as &$chunk ) {
								if ( ! is_string( $chunk ) ) { continue; }
								$processor = new WP_HTML_Tag_Processor( $chunk );
								if ( $processor->next_tag( 'IMG' ) ) {
									$processor->set_attribute( 'src', $url );
									$processor->add_class( 'wp-image-' . $id );
									$chunk = $processor->get_updated_html();
								}
							}
							unset( $chunk );
						}
					}
				}
				$block['innerBlocks'] = $walk( $block['innerBlocks'] );
			}
			return $blocks;
		};
		return serialize_blocks( $walk( parse_blocks( $content ) ) );
	}

	private function navigation() {
		$refs = get_option( 'lakehub_block_navigation', array() );
		$locations = get_nav_menu_locations();
		foreach ( array( 'primary', 'footer', 'footer_help' ) as $location ) {
			if ( ! empty( $refs[ $location ] ) && get_post( $refs[ $location ] ) ) { continue; }
			$items = ! empty( $locations[ $location ] ) ? wp_get_nav_menu_items( $locations[ $location ] ) : array();
			if ( ! $items ) { continue; }
			$build = function ( $parent ) use ( &$build, $items ) {
				$blocks = array();
				foreach ( $items as $item ) {
					if ( (int) $item->menu_item_parent !== $parent ) { continue; }
					$children = $build( (int) $item->ID );
					$blocks[] = array( 'blockName' => $children ? 'core/navigation-submenu' : 'core/navigation-link', 'attrs' => array( 'label' => $item->title, 'url' => $item->url, 'kind' => 'custom', 'opensInNewTab' => '_blank' === $item->target ), 'innerBlocks' => $children, 'innerHTML' => '', 'innerContent' => array_fill( 0, count( $children ), null ) );
				}
				return $blocks;
			};
			$id = wp_insert_post( wp_slash( array( 'post_type' => 'wp_navigation', 'post_status' => 'publish', 'post_title' => 'LakeHub ' . $location, 'post_content' => serialize_blocks( $build( 0 ) ) ) ), true );
			if ( is_wp_error( $id ) ) { WP_CLI::error( $id->get_error_message() ); }
			$refs[ $location ] = $id;
		}
		update_option( 'lakehub_block_navigation', $refs, false );
	}
}
WP_CLI::add_command( 'lakehub blocks', 'LakeHub_Block_Migration' );

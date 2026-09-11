<?php
/** Explicit September 11 refinements with an independent rollback journal. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class LakeHub_Refinements_20260911 {
	const JOURNAL = 'lakehub_refinements_20260911_snapshot';
	const DONE = 'lakehub_refinements_20260911_done';

	/**
	 * Repair the About team link and update the Home hero accent.
	 *
	 * ## OPTIONS
	 * [--dry-run]
	 * : Validate the exact targets without writing.
	 */
	public function apply( $args, $assoc_args ) {
		$this->check_target();
		if ( get_option( self::DONE ) ) {
			WP_CLI::success( 'September 11 refinements already applied; editor changes were left untouched.' );
			return;
		}
		if ( get_option( self::JOURNAL ) ) {
			WP_CLI::error( 'An incomplete refinement run exists. Back up and run rollback before retrying.' );
		}

		$home = get_post( (int) get_option( 'page_on_front' ) );
		$about = get_page_by_path( 'about', OBJECT, 'page' );
		$impact = get_page_by_path( 'impact', OBJECT, 'page' );
		$team = get_page_by_path( 'team', OBJECT, 'page' );
		if ( ! $home || 'page' !== $home->post_type || ! $about || ! $impact || ! $team || 'publish' !== $team->post_status ) {
			WP_CLI::error( 'Expected the Home, About, Impact, and published Team pages.' );
		}

		$team_url = wp_make_link_relative( get_permalink( $team ) );
		if ( ! str_starts_with( $team_url, '/' ) ) {
			WP_CLI::error( 'Could not derive a site-relative Team permalink.' );
		}

		$updates = array(
			$home->ID => $this->patch_home( $home->post_content ),
			$about->ID => $this->patch_media_urls( $this->patch_about( $about->post_content, $team_url ), 7, 'About' ),
			$impact->ID => $this->patch_media_urls( $impact->post_content, 4, 'Impact' ),
		);
		WP_CLI::log( sprintf( 'Local target: %s (%s). Home #%d; About #%d; Impact #%d; Team #%d (%s).', home_url(), ABSPATH, $home->ID, $about->ID, $impact->ID, $team->ID, $team_url ) );
		if ( isset( $assoc_args['dry-run'] ) ) {
			WP_CLI::success( 'Would update the Home innovators color, About full-team link, and About/Impact attachment URLs. No writes performed.' );
			return;
		}

		$journal = array( 'before' => array(), 'after' => array() );
		foreach ( $updates as $id => $content ) {
			$journal['before'][ $id ] = get_post_field( 'post_content', $id );
		}
		if ( ! add_option( self::JOURNAL, $journal, '', false ) ) {
			WP_CLI::error( 'Could not create the refinement recovery journal.' );
		}

		global $wpdb;
		if ( false === $wpdb->query( 'START TRANSACTION' ) ) {
			WP_CLI::error( 'Could not begin content transaction.' );
		}
		foreach ( $updates as $id => $content ) {
			$result = wp_update_post( wp_slash( array( 'ID' => $id, 'post_content' => $content ) ), true );
			if ( is_wp_error( $result ) ) {
				$wpdb->query( 'ROLLBACK' );
				WP_CLI::error( $result->get_error_message() );
			}
			$journal['after'][ $id ] = hash( 'sha256', $content );
		}
		update_option( self::JOURNAL, $journal, false );
		update_option( self::DONE, 1, false );
		if ( false === $wpdb->query( 'COMMIT' ) ) {
			WP_CLI::error( 'Content transaction could not be committed.' );
		}
		WP_CLI::success( 'September 11 refinements applied. Unrelated page content was preserved.' );
	}

	/** Restore only the two refinement-owned page contents. */
	public function rollback() {
		$this->check_target();
		$journal = get_option( self::JOURNAL );
		if ( ! $journal || empty( $journal['before'] ) || empty( $journal['after'] ) ) {
			WP_CLI::error( 'No completed September 11 refinement snapshot exists.' );
		}
		foreach ( $journal['after'] as $id => $hash ) {
			if ( hash( 'sha256', (string) get_post_field( 'post_content', $id ) ) !== $hash ) {
				WP_CLI::error( 'Page changed since refinement: ' . $id . '. Preserve those edits before recovery.' );
			}
		}

		global $wpdb;
		if ( false === $wpdb->query( 'START TRANSACTION' ) ) {
			WP_CLI::error( 'Could not begin content transaction.' );
		}
		foreach ( $journal['before'] as $id => $content ) {
			$result = wp_update_post( wp_slash( array( 'ID' => $id, 'post_content' => $content ) ), true );
			if ( is_wp_error( $result ) ) {
				$wpdb->query( 'ROLLBACK' );
				WP_CLI::error( $result->get_error_message() );
			}
		}
		delete_option( self::DONE );
		delete_option( self::JOURNAL );
		if ( false === $wpdb->query( 'COMMIT' ) ) {
			WP_CLI::error( 'Content transaction could not be committed.' );
		}
		WP_CLI::success( 'Pre-refinement Home, About, and Impact content restored.' );
	}

	private function patch_home( $content ) {
		$hero_count = 0;
		$heading_count = 0;
		$walk = function ( $blocks, $inside_hero = false ) use ( &$walk, &$hero_count, &$heading_count ) {
			foreach ( $blocks as &$block ) {
				$class = $block['attrs']['className'] ?? '';
				$is_hero = $inside_hero || ( 'core/cover' === $block['blockName'] && str_contains( $class, 'is-style-lakehub-home-photo' ) );
				if ( ! $inside_hero && $is_hero ) { ++$hero_count; }
				if ( $is_hero && 'core/heading' === $block['blockName'] && str_contains( strtolower( wp_strip_all_tags( $block['innerHTML'] ) ), 'innovators' ) ) {
					++$heading_count;
					foreach ( $block['innerContent'] as &$html ) {
						if ( is_string( $html ) ) { $html = str_replace( 'has-aqua-color', 'has-vivid-teal-color', $html ); }
					}
					unset( $html );
				}
				$block['innerBlocks'] = $walk( $block['innerBlocks'], $is_hero );
			}
			return $blocks;
		};
		$result = serialize_blocks( $walk( parse_blocks( $content ) ) );
		if ( 1 !== $hero_count || 1 !== $heading_count ) {
			WP_CLI::error( 'Expected one Home hero and one innovators heading; refusing ambiguous edits.' );
		}
		return $result;
	}

	private function patch_about( $content, $team_url ) {
		$button_count = 0;
		$anchor_count = 0;
		$walk = function ( $blocks ) use ( &$walk, &$button_count, &$anchor_count, $team_url ) {
			foreach ( $blocks as &$block ) {
				if ( 'core/button' === $block['blockName'] && str_contains( strtolower( wp_strip_all_tags( $block['innerHTML'] ) ), 'meet the full team' ) ) {
					++$button_count;
					foreach ( $block['innerContent'] as &$html ) {
						if ( ! is_string( $html ) ) { continue; }
						$tags = new WP_HTML_Tag_Processor( $html );
						while ( $tags->next_tag( 'A' ) ) {
							$tags->set_attribute( 'href', $team_url );
							++$anchor_count;
						}
						$html = $tags->get_updated_html();
					}
					unset( $html );
				}
				$block['innerBlocks'] = $walk( $block['innerBlocks'] );
			}
			return $blocks;
		};
		$result = serialize_blocks( $walk( parse_blocks( $content ) ) );
		if ( 1 !== $button_count || 1 !== $anchor_count ) {
			WP_CLI::error( 'Expected one Meet The Full Team button and link; refusing ambiguous edits.' );
		}
		return $result;
	}

	private function patch_media_urls( $content, $expected, $label ) {
		$count = 0;
		$walk = function ( $blocks ) use ( &$walk, &$count ) {
			foreach ( $blocks as &$block ) {
				if ( isset( $block['attrs']['url'] ) && is_string( $block['attrs']['url'] ) ) {
					$relative = $this->relative_upload_url( $block['attrs']['url'] );
					if ( $relative !== $block['attrs']['url'] ) {
						$block['attrs']['url'] = $relative;
						++$count;
					}
				}
				foreach ( $block['innerContent'] as &$html ) {
					if ( ! is_string( $html ) ) { continue; }
					$tags = new WP_HTML_Tag_Processor( $html );
					while ( $tags->next_tag( 'IMG' ) ) {
						$src = $tags->get_attribute( 'src' );
						if ( ! is_string( $src ) ) { continue; }
						$relative = $this->relative_upload_url( $src );
						if ( $relative === $src ) { continue; }
						$tags->set_attribute( 'src', $relative );
						++$count;
					}
					$html = $tags->get_updated_html();
				}
				unset( $html );
				$block['innerBlocks'] = $walk( $block['innerBlocks'] );
			}
			return $blocks;
		};
		$result = serialize_blocks( $walk( parse_blocks( $content ) ) );
		if ( $expected !== $count ) {
			WP_CLI::error( sprintf( 'Expected %d %s attachment URL fields, found %d; refusing ambiguous edits.', $expected, $label, $count ) );
		}
		return $result;
	}

	private function relative_upload_url( $url ) {
		$path = wp_parse_url( $url, PHP_URL_PATH );
		$upload_path = wp_parse_url( wp_upload_dir()['baseurl'], PHP_URL_PATH );
		if ( ! is_string( $path ) || ! is_string( $upload_path ) || ! str_starts_with( $path, trailingslashit( $upload_path ) ) ) {
			return $url;
		}
		$query = wp_parse_url( $url, PHP_URL_QUERY );
		return $path . ( is_string( $query ) && '' !== $query ? '?' . $query : '' );
	}

	private function check_target() {
		if ( 'local' !== wp_get_environment_type() || is_multisite() || 'lakehub-social' !== get_stylesheet() || ! wp_is_block_theme() ) {
			WP_CLI::error( 'Expected the local, single-site LakeHub block theme.' );
		}
	}
}

$lakehub_refinements = new LakeHub_Refinements_20260911();
WP_CLI::add_command( 'lakehub refinements-20260911 apply', array( $lakehub_refinements, 'apply' ) );
WP_CLI::add_command( 'lakehub refinements-20260911 rollback', array( $lakehub_refinements, 'rollback' ) );

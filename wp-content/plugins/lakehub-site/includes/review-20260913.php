<?php
/**
 * Explicit September 13 review migration: rename Community Engagements to Community Projects.
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }

class LakeHub_Review_20260913_Rename_Community {
	const JOURNAL = 'lakehub_review_20260913_community_snapshot';
	const DONE    = 'lakehub_review_20260913_community_done';

	/**
	 * Rename the Impact page heading and metadata to Community Projects.
	 *
	 * ## OPTIONS
	 * [--dry-run]
	 * : Validate the exact target without writing.
	 */
	public function apply( $args, $assoc_args ) {
		$this->check_target();
		if ( get_option( self::DONE ) ) {
			WP_CLI::success( 'Community Projects rename already applied; editor changes were left untouched.' );
			return;
		}
		if ( get_option( self::JOURNAL ) ) {
			WP_CLI::error( 'An incomplete rename run exists. Back up and run rollback before retrying.' );
		}

		$impact = get_page_by_path( 'impact', OBJECT, 'page' );
		if ( ! $impact || 'page' !== $impact->post_type ) {
			WP_CLI::error( 'Expected the published Impact page.' );
		}

		$original_content = $impact->post_content;
		$updated_content  = $this->patch_impact_content( $original_content );

		if ( $original_content === $updated_content ) {
			WP_CLI::error( 'Target Community Engagements heading was not found in the Impact page.' );
		}

		WP_CLI::log( sprintf( 'Local target: %s (%s). Impact page #%d.', home_url(), ABSPATH, $impact->ID ) );

		if ( isset( $assoc_args['dry-run'] ) ) {
			WP_CLI::success( 'Would rename "Community Engagements" heading and metadata to "Community Projects" on Impact page #' . $impact->ID . '. No writes performed.' );
			return;
		}

		$journal = array(
			'page_id' => $impact->ID,
			'before'  => $original_content,
			'after'   => hash( 'sha256', $updated_content ),
		);

		if ( ! add_option( self::JOURNAL, $journal, '', false ) ) {
			WP_CLI::error( 'Could not create the rename recovery journal.' );
		}

		global $wpdb;
		if ( false === $wpdb->query( 'START TRANSACTION' ) ) {
			WP_CLI::error( 'Could not begin database transaction.' );
		}

		$result = wp_update_post(
			wp_slash(
				array(
					'ID'           => $impact->ID,
					'post_content' => $updated_content,
				)
			),
			true
		);

		if ( is_wp_error( $result ) ) {
			$wpdb->query( 'ROLLBACK' );
			delete_option( self::JOURNAL );
			WP_CLI::error( $result->get_error_message() );
		}

		update_option( self::DONE, 1, false );
		if ( false === $wpdb->query( 'COMMIT' ) ) {
			WP_CLI::error( 'Database transaction could not be committed.' );
		}

		WP_CLI::success( 'Impact page heading and metadata successfully renamed to Community Projects.' );
	}

	/**
	 * Roll back the Community Projects rename.
	 *
	 * ## OPTIONS
	 * [--force]
	 * : Force rollback even if content changed after apply.
	 */
	public function rollback( $args, $assoc_args ) {
		$this->check_target();
		$journal = get_option( self::JOURNAL );
		if ( ! is_array( $journal ) || empty( $journal['page_id'] ) || ! isset( $journal['before'] ) || ! isset( $journal['after'] ) ) {
			WP_CLI::error( 'No Community Projects rollback journal found.' );
		}

		$page_id = (int) $journal['page_id'];
		$current = get_post( $page_id );
		if ( ! $current || 'page' !== $current->post_type ) {
			WP_CLI::error( 'Impact page #' . $page_id . ' not found for rollback.' );
		}

		$current_hash = hash( 'sha256', $current->post_content );
		if ( $current_hash !== $journal['after'] && ! isset( $assoc_args['force'] ) ) {
			WP_CLI::error( 'Impact page content was modified after the rename migration was applied. Back up and pass --force to overwrite.' );
		}

		global $wpdb;
		if ( false === $wpdb->query( 'START TRANSACTION' ) ) {
			WP_CLI::error( 'Could not begin database transaction.' );
		}

		$result = wp_update_post(
			wp_slash(
				array(
					'ID'           => $page_id,
					'post_content' => $journal['before'],
				)
			),
			true
		);

		if ( is_wp_error( $result ) ) {
			$wpdb->query( 'ROLLBACK' );
			WP_CLI::error( $result->get_error_message() );
		}

		delete_option( self::JOURNAL );
		delete_option( self::DONE );

		if ( false === $wpdb->query( 'COMMIT' ) ) {
			WP_CLI::error( 'Database transaction could not be committed.' );
		}

		WP_CLI::success( 'Community Projects rename rolled back to Community Engagements.' );
	}

	private function patch_impact_content( $content ) {
		$blocks = parse_blocks( $content );
		$walk   = function ( &$block_list ) use ( &$walk ) {
			foreach ( $block_list as &$block ) {
				if ( 'core/group' === $block['blockName'] && isset( $block['attrs']['anchor'] ) && 'community-engagements' === $block['attrs']['anchor'] ) {
					if ( isset( $block['attrs']['metadata']['name'] ) ) {
						$block['attrs']['metadata']['name'] = 'Impact · Community Projects';
					}
					foreach ( $block['innerBlocks'] as &$child ) {
						if ( 'core/heading' === $child['blockName'] ) {
							$child['innerHTML']    = str_replace( 'Engagements', 'Projects', $child['innerHTML'] );
							if ( isset( $child['innerContent'][0] ) ) {
								$child['innerContent'][0] = str_replace( 'Engagements', 'Projects', $child['innerContent'][0] );
							}
						}
					}
					unset( $child );
				}
				if ( ! empty( $block['innerBlocks'] ) ) {
					$walk( $block['innerBlocks'] );
				}
			}
			unset( $block );
		};
		$walk( $blocks );
		return serialize_blocks( $blocks );
	}

	private function check_target() {
		if ( 'local' !== wp_get_environment_type() || is_multisite() || 'lakehub-social' !== get_stylesheet() || ! wp_is_block_theme() ) {
			WP_CLI::error( 'Expected the local, single-site LakeHub block theme.' );
		}
	}
}

$lakehub_rename_community = new LakeHub_Review_20260913_Rename_Community();
WP_CLI::add_command( 'lakehub review-20260913 rename-community apply', array( $lakehub_rename_community, 'apply' ) );
WP_CLI::add_command( 'lakehub review-20260913 rename-community rollback', array( $lakehub_rename_community, 'rollback' ) );

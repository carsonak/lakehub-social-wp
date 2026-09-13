<?php
/**
 * Plugin Name: LakeHub Site
 * Description: LakeHub programs and explicit block-content migrations.
 * Version: 1.2.1
 * Requires at least: 7.1
 * Requires PHP: 8.0
 * Text Domain: lakehub-site
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
require_once __DIR__ . '/includes/programs.php';
require_once __DIR__ . '/includes/team.php';
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once __DIR__ . '/includes/migration.php';
	require_once __DIR__ . '/includes/design-refresh.php';
	require_once __DIR__ . '/includes/completion.php';
	require_once __DIR__ . '/includes/refinements.php';
	require_once __DIR__ . '/includes/review-20260913.php';
}

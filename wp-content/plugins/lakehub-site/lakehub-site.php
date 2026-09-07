<?php
/**
 * Plugin Name: LakeHub Site
 * Description: LakeHub programs and explicit block-content migrations.
 * Version: 1.0.0
 * Requires at least: 7.1
 * Requires PHP: 8.0
 * Text Domain: lakehub-site
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
require_once __DIR__ . '/includes/programs.php';
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	require_once __DIR__ . '/includes/migration.php';
}

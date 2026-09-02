<?php
/** WordPress configuration loaded from the untracked project .env file. */

/** Load a small, deliberately non-evaluating subset of dotenv syntax. */
function lakehub_load_env(string $path): void
{
	if (!is_readable($path)) {
		return;
	}
	$lines = file($path, FILE_IGNORE_NEW_LINES);
	if ($lines === false) {
		return;
	}
	foreach ($lines as $line) {
		$line = trim($line);
		if ($line === '' || str_starts_with($line, '#')) {
			continue;
		}
		if (str_starts_with($line, 'export ')) {
			$line = ltrim(substr($line, 7));
		}
		$separator = strpos($line, '=');
		if ($separator === false) {
			continue;
		}
		$name = trim(substr($line, 0, $separator));
		if (!preg_match('/^[A-Za-z_][A-Za-z0-9_]*$/', $name) || getenv($name) !== false) {
			continue;
		}
		$value = trim(substr($line, $separator + 1));
		$length = strlen($value);
		if ($length >= 2 && (($value[0] === "'" && $value[$length - 1] === "'") || ($value[0] === '"' && $value[$length - 1] === '"'))) {
			$value = substr($value, 1, -1);
		}
		putenv($name . '=' . $value);
		$_ENV[$name] = $value;
	}
}

function lakehub_required_env(string $name): string
{
	$value = getenv($name);
	if ($value === false || $value === '') {
		throw new RuntimeException("Missing required environment value: {$name}. Copy .env.example to .env and configure it.");
	}
	return $value;
}

function lakehub_optional_env(string $name, string $default = ''): string
{
	$value = getenv($name);
	return ($value === false || $value === '') ? $default : $value;
}

lakehub_load_env(__DIR__ . '/.env');

define('DB_NAME', lakehub_required_env('DB_NAME'));
define('DB_USER', lakehub_required_env('DB_USER'));
define('DB_PASSWORD', lakehub_required_env('DB_PASSWORD'));
define('DB_HOST', lakehub_required_env('DB_HOST'));
define('DB_CHARSET', lakehub_optional_env('DB_CHARSET', 'utf8mb4'));
define('DB_COLLATE', lakehub_optional_env('DB_COLLATE'));

define('AUTH_KEY', lakehub_required_env('AUTH_KEY'));
define('SECURE_AUTH_KEY', lakehub_required_env('SECURE_AUTH_KEY'));
define('LOGGED_IN_KEY', lakehub_required_env('LOGGED_IN_KEY'));
define('NONCE_KEY', lakehub_required_env('NONCE_KEY'));
define('AUTH_SALT', lakehub_required_env('AUTH_SALT'));
define('SECURE_AUTH_SALT', lakehub_required_env('SECURE_AUTH_SALT'));
define('LOGGED_IN_SALT', lakehub_required_env('LOGGED_IN_SALT'));
define('NONCE_SALT', lakehub_required_env('NONCE_SALT'));
define('WP_CACHE_KEY_SALT', lakehub_required_env('WP_CACHE_KEY_SALT'));

$table_prefix = lakehub_optional_env('DB_TABLE_PREFIX', 'wp_');

$wp_home = lakehub_optional_env('WP_HOME');
if ($wp_home !== '') {
	define('WP_HOME', $wp_home);
}
$wp_siteurl = lakehub_optional_env('WP_SITEURL');
if ($wp_siteurl !== '') {
	define('WP_SITEURL', $wp_siteurl);
}

define('WP_ENVIRONMENT_TYPE', lakehub_optional_env('WP_ENVIRONMENT_TYPE', 'local'));
define('WP_DEBUG', filter_var(lakehub_optional_env('WP_DEBUG', 'false'), FILTER_VALIDATE_BOOLEAN));

if (!defined('ABSPATH')) {
	define('ABSPATH', __DIR__ . '/');
}
require_once ABSPATH . 'wp-settings.php';

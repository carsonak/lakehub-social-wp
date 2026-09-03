<?php
/** Partner carousel. @var array $args */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$render_partner = static function ( $item, $duplicate = false ) {
	$name      = isset( $item['name'] ) ? $item['name'] : '';
	$logo_id   = isset( $item['logo_id'] ) ? absint( $item['logo_id'] ) : 0;
	$logo_file = isset( $item['logo_file'] ) ? $item['logo_file'] : '';
	$url       = isset( $item['url'] ) ? $item['url'] : '';
	$content   = $logo_id || $logo_file ? lakehub_social_image( $logo_id, $logo_file, $name ) : '<span>' . esc_html( $name ) . '</span>';
	echo '<div class="partner-logo">';
	if ( $url ) {
		echo '<a href="' . esc_url( $url ) . '" target="_blank" rel="noopener noreferrer"' . ( $duplicate ? ' tabindex="-1"' : '' ) . '>' . $content . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	} else {
		echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
	echo '</div>';
};
?>
<section class="partners" aria-label="<?php echo esc_attr( $args['label'] ); ?>">
	<p class="partners-label"><?php echo esc_html( $args['label'] ); ?></p>
	<?php if ( ! empty( $args['items'] ) ) : ?>
		<div class="partner-marquee">
			<div class="partner-track">
				<div class="partner-set"><?php foreach ( $args['items'] as $item ) { $render_partner( $item ); } ?></div>
				<div class="partner-set" aria-hidden="true"><?php foreach ( $args['items'] as $item ) { $render_partner( $item, true ); } ?></div>
			</div>
		</div>
	<?php endif; ?>
</section>

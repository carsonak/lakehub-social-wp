<?php
/** Partners section. @var array $args */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<section class="partners" aria-label="<?php echo esc_attr( $args['label'] ); ?>"><div class="container">
	<p class="partners-label"><?php echo esc_html( $args['label'] ); ?></p>
	<?php if ( ! empty( $args['items'] ) ) : ?><div class="partner-row" style="--partner-count:<?php echo esc_attr( count( $args['items'] ) ); ?>">
		<?php foreach ( $args['items'] as $index => $item ) :
			$fallback = 0 === $index ? 'partner-giz.png' : ( 2 === $index ? 'partner-pfe.png' : '' );
			$content  = ( ! empty( $item['logo_id'] ) || $fallback ) ? lakehub_social_image( $item['logo_id'], $fallback, $item['name'] ) : '<span class="partner-word">' . esc_html( $item['name'] ) . '</span>';
			?><div class="partner"><?php if ( ! empty( $item['url'] ) ) : ?><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></a><?php else : echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?><?php endif; ?></div>
		<?php endforeach; ?>
	</div><?php endif; ?>
</div></section>

<?php
/** Program card. @var array $args */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$post_id = get_the_ID();
$url     = get_post_meta( $post_id, '_lakehub_program_url', true );
$image   = lakehub_social_program_image( $post_id );
$reverse = ! empty( $args['index'] ) && 1 === ( (int) $args['index'] % 2 );
?>
<article <?php post_class( 'program-card' . ( $reverse ? ' program-card--reverse' : '' ) ); ?>>
	<div class="program-card-image"><?php echo $image; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
	<div class="program-card-copy">
		<h2><?php the_title(); ?></h2>
		<p><?php echo esc_html( has_excerpt() ? get_the_excerpt() : wp_trim_words( get_the_content(), 90 ) ); ?></p>
		<?php if ( $url ) : ?><a class="program-link" href="<?php echo esc_url( $url ); ?>"><?php esc_html_e( 'Learn More', 'lakehub-social' ); ?> <span aria-hidden="true">→</span></a><?php else : ?><span class="program-link program-link--static"><?php esc_html_e( 'Learn More', 'lakehub-social' ); ?> <span aria-hidden="true">→</span></span><?php endif; ?>
	</div>
</article>

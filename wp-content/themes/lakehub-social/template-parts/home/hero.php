<?php
/** Homepage hero. @var array $args */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<section class="hero" id="home"><div class="container hero-grid">
	<div class="hero-copy reveal">
		<?php if ( $args['eyebrow'] ) : ?><p class="eyebrow"><?php echo esc_html( $args['eyebrow'] ); ?></p><?php endif; ?>
		<h1><?php echo esc_html( $args['title'] ); ?><?php if ( $args['title_accent'] ) : ?> <span><?php echo esc_html( $args['title_accent'] ); ?></span><?php endif; ?></h1>
		<?php if ( $args['text'] ) : ?><p><?php echo esc_html( $args['text'] ); ?></p><?php endif; ?>
		<div class="hero-actions">
			<?php if ( $args['primary_label'] && $args['primary_url'] ) : ?><a class="button button--solid" href="<?php echo esc_url( $args['primary_url'] ); ?>"><?php echo esc_html( $args['primary_label'] ); ?></a><?php endif; ?>
			<?php if ( $args['secondary_label'] && $args['secondary_url'] ) : ?><a class="button button--ghost" href="<?php echo esc_url( $args['secondary_url'] ); ?>"><?php echo esc_html( $args['secondary_label'] ); ?></a><?php endif; ?>
		</div>
	</div>
	<div class="hero-visual reveal"><?php echo lakehub_social_image( $args['image_id'], 'figma-2691.png', __( 'LakeHub community members outside the LakeHub centre', 'lakehub-social' ), array( 'width' => 339, 'height' => 226 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
</div></section>

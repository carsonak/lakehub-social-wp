<?php
/** Homepage hero. @var array $args */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<section class="hero" id="home">
	<div class="page-container hero-grid">
		<div class="hero-copy reveal">
			<?php $hero_lead = str_replace( ' next ', '<br>next ', esc_html( $args['title'] ) ); ?>
			<h1><?php echo wp_kses( $hero_lead, array( 'br' => array() ) ); ?><br><span><?php echo esc_html( $args['title_accent'] ); ?></span> <?php echo esc_html( $args['title_tail'] ); ?></h1>
			<p><?php echo esc_html( $args['text'] ); ?></p>
			<div class="hero-actions">
				<?php if ( $args['primary_label'] && $args['primary_url'] ) : ?><a class="button button--solid" href="<?php echo esc_url( $args['primary_url'] ); ?>"><?php echo esc_html( $args['primary_label'] ); ?></a><?php endif; ?>
				<?php if ( $args['secondary_label'] && $args['secondary_url'] ) : ?><a class="button button--outline" href="<?php echo esc_url( $args['secondary_url'] ); ?>"><?php echo esc_html( $args['secondary_label'] ); ?></a><?php endif; ?>
			</div>
		</div>
		<div class="hero-visual reveal"><?php echo lakehub_social_image( $args['image_id'], 'home-hero.png', __( 'LakeHub community outside the innovation centre', 'lakehub-social' ), array( 'width' => 678, 'height' => 452 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
	</div>
</section>

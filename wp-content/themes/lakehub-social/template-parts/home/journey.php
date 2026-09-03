<?php
/** Journey section. @var array $args */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<section class="journey" id="impact">
	<div class="page-container">
		<header class="journey-heading reveal"><h2><?php echo esc_html( $args['title'] ); ?></h2><p><?php echo esc_html( $args['intro'] ); ?></p></header>
		<?php if ( ! empty( $args['milestones'] ) ) : ?>
			<div class="timeline-scroll" tabindex="0" aria-label="<?php esc_attr_e( 'LakeHub journey timeline', 'lakehub-social' ); ?>">
				<div class="timeline" style="--milestone-count:<?php echo esc_attr( count( $args['milestones'] ) ); ?>">
					<?php foreach ( $args['milestones'] as $item ) : ?>
						<article class="milestone reveal" tabindex="0">
							<h3><?php echo esc_html( $item['title'] ); ?></h3><p><?php echo esc_html( $item['text'] ); ?></p><div class="milestone-dot" aria-hidden="true"></div><time><?php echo esc_html( $item['year'] ); ?></time>
						</article>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endif; ?>
	</div>
</section>

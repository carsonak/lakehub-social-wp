<?php
/** Journey section. @var array $args */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<section class="journey" id="impact"><div class="container">
	<p class="eyebrow"><?php echo esc_html( $args['eyebrow'] ); ?></p><h2 class="section-title"><?php echo esc_html( $args['title'] ); ?></h2><p class="intro"><?php echo esc_html( $args['intro'] ); ?></p>
	<?php if ( ! empty( $args['milestones'] ) ) : ?><div class="timeline" style="--milestone-count:<?php echo esc_attr( count( $args['milestones'] ) ); ?>">
		<?php foreach ( $args['milestones'] as $item ) : ?><article class="milestone reveal"><time><?php echo esc_html( $item['year'] ); ?></time><div class="milestone-dot"></div><h3><?php echo esc_html( $item['title'] ); ?></h3><p><?php echo esc_html( $item['text'] ); ?></p></article><?php endforeach; ?>
	</div><?php endif; ?>
</div></section>

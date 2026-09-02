<?php
/** CTA section. @var array $args */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<section class="cta" id="community"><div class="container reveal"><h2><?php echo esc_html( $args['title'] ); ?></h2><p><?php echo esc_html( $args['text'] ); ?></p><?php if ( $args['button_label'] && $args['button_url'] ) : ?><a class="button" href="<?php echo esc_url( $args['button_url'] ); ?>"><?php echo esc_html( $args['button_label'] ); ?></a><?php endif; ?></div></section>

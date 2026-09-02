<?php
/** Mission section. @var array $args */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<section class="mission" id="about"><div class="container mission-grid">
	<div class="mission-copy reveal"><p class="eyebrow"><?php echo esc_html( $args['about_eyebrow'] ); ?></p><h2 class="section-title"><?php echo esc_html( $args['about_title'] ); ?></h2><p><?php echo esc_html( $args['about_text'] ); ?></p></div>
	<div class="mission-image mission-image--right reveal"><?php echo lakehub_social_image( $args['about_image_id'], 'figma-354f.jpg', __( 'LakeHub community gathering', 'lakehub-social' ), array( 'width' => 274, 'height' => 183 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
	<div class="mission-image mission-image--left reveal" id="programs"><?php echo lakehub_social_image( $args['work_image_id'], 'figma-work.jpg', __( 'Young women collaborating in a LakeHub mentorship session', 'lakehub-social' ), array( 'width' => 323, 'height' => 155 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
	<div class="mission-copy mission-copy--right reveal"><p class="eyebrow"><?php echo esc_html( $args['work_eyebrow'] ); ?></p><h2 class="section-title"><?php echo esc_html( $args['work_title'] ); ?></h2><p><?php echo esc_html( $args['work_text'] ); ?></p></div>
</div></section>

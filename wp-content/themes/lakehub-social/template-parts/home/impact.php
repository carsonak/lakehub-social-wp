<?php
/** Impact bento section. @var array $args */
if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<section class="impact" id="about">
	<div class="page-container">
		<header class="impact-heading reveal">
			<h2><?php echo esc_html( $args['title'] ); ?> <strong><?php echo esc_html( $args['title_accent'] ); ?></strong></h2>
			<p><?php echo esc_html( $args['intro'] ); ?></p>
		</header>
		<div class="impact-grid">
			<article class="impact-feature reveal">
				<div class="impact-feature-image"><?php echo lakehub_social_image( $args['incubator_image_id'], 'impact-incubator.png', __( 'LakeHub program participants', 'lakehub-social' ), array( 'width' => 1128, 'height' => 926 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
				<div class="impact-feature-copy"><p><?php echo esc_html( $args['incubator_text'] ); ?></p><?php if ( $args['incubator_label'] && $args['incubator_url'] ) : ?><a class="text-link" href="<?php echo esc_url( $args['incubator_url'] ); ?>"><?php echo esc_html( $args['incubator_label'] ); ?> <span aria-hidden="true">→</span></a><?php endif; ?></div>
			</article>
			<div class="impact-photo reveal"><?php echo lakehub_social_image( $args['community_image_id'], 'impact-community.jpg', __( 'LakeHub community members', 'lakehub-social' ), array( 'width' => 547, 'height' => 365 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
			<article class="impact-programs reveal" id="programs">
				<div class="impact-programs-image"><?php echo lakehub_social_image( $args['programs_image_id'], 'impact-programs.png', __( 'LakeHub training session', 'lakehub-social' ), array( 'width' => 1422, 'height' => 800 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
				<p><?php echo esc_html( $args['programs_text'] ); ?></p>
			</article>
		</div>
	</div>
</section>

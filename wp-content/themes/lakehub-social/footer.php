<?php
/** Site footer. @package LakeHub_Social */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$phone = lakehub_social_get_site_setting( 'phone' );
$email = lakehub_social_get_site_setting( 'email' );
?>
<footer class="site-footer"><div class="container">
	<div class="footer-grid">
		<div class="footer-brand">
			<?php if ( has_custom_logo() ) : the_custom_logo(); else : echo lakehub_social_image( 0, 'figma-b858.png', get_bloginfo( 'name' ) ); endif; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<p><?php echo esc_html( lakehub_social_get_site_setting( 'tagline' ) ); ?></p>
		</div>
		<div><h2 class="footer-title"><?php esc_html_e( 'Quick links', 'lakehub-social' ); ?></h2><nav class="footer-links" aria-label="<?php esc_attr_e( 'Footer navigation', 'lakehub-social' ); ?>"><?php wp_nav_menu( array( 'theme_location' => 'footer', 'container' => false, 'items_wrap' => '<ul class="menu">%3$s</ul>', 'fallback_cb' => 'lakehub_social_footer_menu_fallback', 'depth' => 1 ) ); ?></nav></div>
		<div class="footer-contact"><h2 class="footer-title"><?php esc_html_e( 'Get in touch', 'lakehub-social' ); ?></h2>
			<p><?php echo nl2br( esc_html( lakehub_social_get_site_setting( 'address' ) ) ); ?></p>
			<?php if ( $phone ) : ?><p><a href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a></p><?php endif; ?>
			<?php if ( $email ) : ?><p><a href="<?php echo esc_url( 'mailto:' . $email ); ?>"><?php echo esc_html( $email ); ?></a></p><?php endif; ?>
		</div>
	</div>
	<div class="footer-bottom"><span>© <?php echo esc_html( wp_date( 'Y' ) ); ?> <?php echo esc_html( get_bloginfo( 'name' ) ); ?>. <?php esc_html_e( 'All rights reserved.', 'lakehub-social' ); ?></span><span><?php echo esc_html( lakehub_social_get_site_setting( 'footer_note' ) ); ?></span></div>
</div></footer>
<?php wp_footer(); ?>
</body></html>
<?php

/** Render footer links until an editor assigns a menu. */
function lakehub_social_footer_menu_fallback() {
	foreach ( array( '#about' => 'About us', '#programs' => 'Programs', '#impact' => 'Our impact', '#stories' => 'Insights', '#community' => 'Community' ) as $url => $label ) {
		echo '<a href="' . esc_url( $url ) . '">' . esc_html( $label ) . '</a>';
	}
}

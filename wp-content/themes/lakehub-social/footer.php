<?php
/** Site footer. @package LakeHub_Social */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$socials = array(
	'linkedin' => lakehub_social_get_site_setting( 'linkedin_url' ),
	'facebook' => lakehub_social_get_site_setting( 'facebook_url' ),
	'x'        => lakehub_social_get_site_setting( 'x_url' ),
);
?>
<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-brand-column">
			<a class="footer-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
				<?php echo lakehub_social_image( 0, 'logo-footer.png', get_bloginfo( 'name' ), array( 'width' => 288, 'height' => 82 ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</a>
			<div class="footer-socials" aria-label="<?php esc_attr_e( 'Social media', 'lakehub-social' ); ?>">
				<?php foreach ( $socials as $network => $url ) : ?>
					<?php if ( $url ) : ?><a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( ucfirst( $network ) ); ?>"><?php else : ?><span><?php endif; ?>
						<img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/' . $network . '.svg' ) ); ?>" width="22" height="22" alt="">
					<?php if ( $url ) : ?></a><?php else : ?></span><?php endif; ?>
				<?php endforeach; ?>
			</div>
		</div>
		<div class="footer-links-column">
			<h2><?php esc_html_e( 'Quick Links', 'lakehub-social' ); ?></h2>
			<?php wp_nav_menu( array( 'theme_location' => 'footer', 'container' => false, 'items_wrap' => '<ul class="footer-menu">%3$s</ul>', 'fallback_cb' => 'lakehub_social_footer_menu_fallback', 'depth' => 1 ) ); ?>
		</div>
		<div class="footer-links-column">
			<h2><?php esc_html_e( 'Help', 'lakehub-social' ); ?></h2>
			<?php wp_nav_menu( array( 'theme_location' => 'footer_help', 'container' => false, 'items_wrap' => '<ul class="footer-menu">%3$s</ul>', 'fallback_cb' => 'lakehub_social_footer_help_fallback', 'depth' => 1 ) ); ?>
		</div>
		<div class="footer-newsletter">
			<p class="footer-kicker"><?php esc_html_e( 'Get in touch!', 'lakehub-social' ); ?></p>
			<p><?php esc_html_e( 'Subscribe to our news letter', 'lakehub-social' ); ?></p>
			<div class="newsletter-control" role="group" aria-label="<?php esc_attr_e( 'Newsletter preview', 'lakehub-social' ); ?>">
				<span>example@gmail.com</span><button type="button"><?php esc_html_e( 'Subscribe', 'lakehub-social' ); ?></button>
			</div>
		</div>
	</div>
	<div class="footer-bottom">
		<span>© <?php echo esc_html( wp_date( 'Y' ) ); ?> LakeHub Foundation. <?php esc_html_e( 'All rights reserved.', 'lakehub-social' ); ?></span>
		<div>
			<?php $privacy_url = lakehub_social_get_site_setting( 'privacy_url' ); ?>
			<?php if ( $privacy_url ) : ?><a href="<?php echo esc_url( $privacy_url ); ?>"><?php esc_html_e( 'Privacy Policy', 'lakehub-social' ); ?></a><?php else : ?><span><?php esc_html_e( 'Privacy Policy', 'lakehub-social' ); ?></span><?php endif; ?>
			<a href="<?php echo esc_url( lakehub_social_get_site_setting( 'contact_url' ) ); ?>"><?php esc_html_e( 'Contact Us', 'lakehub-social' ); ?></a>
		</div>
	</div>
</footer>
<?php wp_footer(); ?>
</body>
</html>
<?php

/** Fallback footer links matching the Figma labels. */
function lakehub_social_footer_menu_fallback() {
	$links = array(
		array( '/#about', 'About Us' ),
		array( '/#about', 'Our Mission' ),
		array( '/#stories', 'Impact Stories' ),
		array( '/#impact', 'History' ),
	);
	echo '<ul class="footer-menu">';
	foreach ( $links as $link ) {
		echo '<li><a href="' . esc_url( home_url( $link[0] ) ) . '">' . esc_html( $link[1] ) . '</a></li>';
	}
	echo '</ul>';
}

/** Fallback help links matching the Figma labels. */
function lakehub_social_footer_help_fallback() {
	echo '<ul class="footer-menu"><li><span>' . esc_html__( 'FAQ', 'lakehub-social' ) . '</span></li><li><span>' . esc_html__( 'Support', 'lakehub-social' ) . '</span></li></ul>';
}

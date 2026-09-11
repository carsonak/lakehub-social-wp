<?php
/** Dynamic collection; all presentation is styled by the theme. @package LakeHub_Site */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$programs = get_posts( array( 'post_type' => 'program', 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => array( 'menu_order' => 'ASC', 'title' => 'ASC', 'ID' => 'ASC' ) ) );
?>
<div <?php echo get_block_wrapper_attributes(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( ! $programs ) : ?>
		<p><?php esc_html_e( 'Programs will appear here when they are published.', 'lakehub-site' ); ?></p>
	<?php endif; ?>
	<?php foreach ( $programs as $program ) :
		$url = get_post_meta( $program->ID, '_lakehub_program_url', true );
		?>
		<article class="lakehub-program">
			<div class="lakehub-program-image"><?php echo get_the_post_thumbnail( $program->ID, 'full', array( 'loading' => 'lazy' ) ); ?></div>
			<div class="lakehub-program-copy">
				<h3><?php echo esc_html( get_the_title( $program ) ); ?></h3>
				<div class="lakehub-program-description"><?php
					// Program content is canonical; excerpts remain for backwards compatibility.
					$content = $program->post_content ?: $program->post_excerpt;
					echo wp_kses_post( has_blocks( $content ) ? do_blocks( $content ) : wpautop( $content ) );
				?></div>
				<?php if ( $url ) : ?>
					<a class="lakehub-program-link" href="<?php echo esc_url( $url ); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'Learn more about %s', 'lakehub-site' ), get_the_title( $program ) ) ); ?>"><?php esc_html_e( 'Learn More ➜', 'lakehub-site' ); ?></a>
				<?php else : ?><span class="lakehub-program-link"><?php esc_html_e( 'Learn More ➜', 'lakehub-site' ); ?></span><?php endif; ?>
			</div>
		</article>
	<?php endforeach; ?>
</div>

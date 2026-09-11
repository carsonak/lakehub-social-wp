<?php
/** Shared team collection; the theme owns presentation. @package LakeHub_Site */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$limit = absint( $attributes['limit'] ?? 0 );
$args = array( 'post_type' => 'lakehub_team_member', 'post_status' => 'publish', 'numberposts' => $limit ? min( 100, $limit ) : -1, 'orderby' => array( 'menu_order' => 'ASC', 'title' => 'ASC', 'ID' => 'ASC' ) );
if ( ! empty( $attributes['featuredOnly'] ) ) { $args['meta_key'] = '_lakehub_team_featured'; $args['meta_value'] = '1'; }
$members = get_posts( $args );
?>
<div <?php echo get_block_wrapper_attributes(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( ! $members ) : ?><p><?php esc_html_e( 'Team members will appear here when published.', 'lakehub-site' ); ?></p><?php endif; ?>
	<div class="lakehub-team-grid">
		<?php foreach ( $members as $member ) :
			$crop = get_post_meta( $member->ID, '_lakehub_team_crop', true );
			$design_crop = is_array( $crop ) && (int) get_post_meta( $member->ID, '_lakehub_team_source_image', true ) === (int) get_post_thumbnail_id( $member->ID );
			$crop_style = '';
			if ( $design_crop ) {
				foreach ( array( 'width', 'height', 'left', 'top' ) as $property ) { $crop_style .= '--lakehub-crop-' . $property . ':' . (float) ( $crop[ $property ] ?? 0 ) . '%;'; }
			}
			?>
		<article class="lakehub-team-card">
			<div class="lakehub-team-photo<?php echo $design_crop ? ' has-design-crop' : ''; ?>" style="<?php echo esc_attr( $crop_style ); ?>"><?php echo get_the_post_thumbnail( $member->ID, 'large', array( 'loading' => 'lazy' ) ); ?></div>
			<div class="lakehub-team-copy">
				<h3><?php echo esc_html( get_the_title( $member ) ); ?></h3>
				<p class="lakehub-team-role"><?php echo esc_html( get_post_meta( $member->ID, '_lakehub_team_role', true ) ); ?></p>
				<div class="lakehub-team-bio"><?php echo wp_kses_post( do_blocks( $member->post_content ) ); ?></div>
			</div>
		</article>
		<?php endforeach; ?>
	</div>
</div>

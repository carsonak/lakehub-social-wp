<?php
/**
 * Template Name: Programs
 *
 * @package LakeHub_Social
 */
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
$programs = new WP_Query(
	array(
		'post_type'      => 'program',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'orderby'        => array( 'menu_order' => 'ASC', 'title' => 'ASC' ),
	)
);
?>
<main id="main-content" class="programs-page">
	<div class="programs-container">
		<h1><?php the_title(); ?></h1>
		<?php if ( $programs->have_posts() ) : ?>
			<div class="program-list">
				<?php $program_index = 0; while ( $programs->have_posts() ) : $programs->the_post(); get_template_part( 'template-parts/program-card', null, array( 'index' => $program_index ) ); $program_index++; endwhile; wp_reset_postdata(); ?>
			</div>
		<?php else : ?><p class="programs-empty"><?php esc_html_e( 'Programs will appear here when they are published.', 'lakehub-social' ); ?></p><?php endif; ?>
	</div>
</main>
<?php get_footer(); ?>

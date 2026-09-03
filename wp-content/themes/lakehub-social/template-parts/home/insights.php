<?php
/** Insights section. @var array $args */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$insights_query = lakehub_social_insights_query();
?>
<section class="insights" id="stories">
	<div class="page-container">
		<header class="insights-heading reveal"><h2><?php echo esc_html( $args['title'] ); ?></h2><p><?php echo esc_html( $args['intro'] ); ?></p></header>
		<?php if ( $insights_query->have_posts() ) : ?>
			<div class="insights-stage">
				<button class="insights-nav insights-nav--previous" type="button" aria-label="<?php esc_attr_e( 'Previous insights', 'lakehub-social' ); ?>">←</button>
				<div class="insight-cards">
					<?php while ( $insights_query->have_posts() ) : $insights_query->the_post(); ?>
						<?php $insight_image = lakehub_social_insight_image( get_the_ID() ); ?>
						<article <?php post_class( 'insight-card reveal' ); ?>>
							<?php if ( $insight_image ) : ?><a class="insight-card-image" href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true"><?php echo $insight_image; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></a><?php endif; ?>
							<div class="insight-card-body"><h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3><p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 24 ) ); ?></p><a class="insight-arrow" href="<?php the_permalink(); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'Read %s', 'lakehub-social' ), get_the_title() ) ); ?>">→</a></div>
						</article>
					<?php endwhile; wp_reset_postdata(); ?>
				</div>
				<button class="insights-nav insights-nav--next" type="button" aria-label="<?php esc_attr_e( 'Next insights', 'lakehub-social' ); ?>">→</button>
			</div>
		<?php else : ?><p class="insights-empty"><?php esc_html_e( 'Publish an Insight to display it here.', 'lakehub-social' ); ?></p><?php endif; ?>
	</div>
</section>

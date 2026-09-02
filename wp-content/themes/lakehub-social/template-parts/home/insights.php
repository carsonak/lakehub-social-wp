<?php
/** Insights section. @var array $args */
if ( ! defined( 'ABSPATH' ) ) { exit; }
$insights_query = lakehub_social_insights_query( $args );
?>
<section class="insights" id="stories"><div class="container">
	<div class="insights-head"><div><p class="eyebrow"><?php echo esc_html( $args['eyebrow'] ); ?></p><h2 class="section-title"><?php echo esc_html( $args['title'] ); ?></h2></div><p><?php echo esc_html( $args['intro'] ); ?></p></div>
	<?php if ( $insights_query->have_posts() ) : ?><div class="cards">
		<?php while ( $insights_query->have_posts() ) : $insights_query->the_post(); ?>
			<article <?php post_class( 'card reveal' ); ?>>
				<?php if ( has_post_thumbnail() ) : ?><a class="card-image" href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true"><?php the_post_thumbnail( 'large' ); ?></a><?php endif; ?>
				<div class="card-body"><p class="card-meta"><?php $category = get_the_category(); echo esc_html( $category ? $category[0]->name : __( 'Insights', 'lakehub-social' ) ); ?> · <?php echo esc_html( lakehub_social_reading_time( get_the_ID() ) ); ?> <?php esc_html_e( 'min read', 'lakehub-social' ); ?></p><h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3><p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 24 ) ); ?></p><a class="card-arrow" href="<?php the_permalink(); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'Read %s', 'lakehub-social' ), get_the_title() ) ); ?>">→</a></div>
			</article>
		<?php endwhile; wp_reset_postdata(); ?>
	</div><?php else : ?><p class="insights-empty"><?php esc_html_e( 'Publish a post to display insights here.', 'lakehub-social' ); ?></p><?php endif; ?>
</div></section>

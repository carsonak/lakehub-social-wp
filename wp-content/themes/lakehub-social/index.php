<?php
/** Standard posts, pages, archives, and fallback template. @package LakeHub_Social */
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
?>
<main id="main-content" class="content-shell"><div class="container">
	<?php if ( have_posts() ) : ?>
		<?php if ( is_archive() ) : ?><header class="archive-header"><h1 class="section-title"><?php the_archive_title(); ?></h1><?php the_archive_description( '<div class="archive-description">', '</div>' ); ?></header><?php endif; ?>
		<div class="content-list">
		<?php while ( have_posts() ) : the_post(); ?>
			<article <?php post_class( is_singular() ? 'entry entry--single' : 'entry' ); ?>>
				<header class="entry-header"><h1 class="entry-title"><?php if ( is_singular() ) : the_title(); else : ?><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a><?php endif; ?></h1><?php if ( 'post' === get_post_type() ) : ?><p class="entry-meta"><?php echo esc_html( get_the_date() ); ?></p><?php endif; ?></header>
				<?php if ( is_singular() ) : ?>
					<?php if ( has_post_thumbnail() ) : ?><div class="entry-image"><?php the_post_thumbnail( 'full' ); ?></div><?php endif; ?><div class="entry-content"><?php the_content(); ?></div>
				<?php else : ?><div class="entry-summary"><?php the_excerpt(); ?></div><?php endif; ?>
			</article>
		<?php endwhile; ?>
		</div>
		<?php the_posts_pagination(); ?>
	<?php else : ?><p><?php esc_html_e( 'Nothing was found.', 'lakehub-social' ); ?></p><?php endif; ?>
</div></main>
<?php get_footer(); ?>

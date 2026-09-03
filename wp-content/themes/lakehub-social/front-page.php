<?php
/** Editable LakeHub homepage. @package LakeHub_Social */
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
?>
<main id="main-content">
	<?php
	foreach ( array( 'hero', 'impact', 'journey', 'partners', 'insights', 'cta' ) as $section ) {
		get_template_part( 'template-parts/home/' . $section, null, lakehub_social_get_home_section( $section ) );
	}
	?>
</main>
<?php get_footer(); ?>

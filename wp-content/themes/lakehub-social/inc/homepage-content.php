<?php
/**
 * Homepage content model and frontend helpers.
 *
 * @package LakeHub_Social
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return all safe homepage defaults.
 *
 * @return array<string, mixed>
 */
function lakehub_social_homepage_defaults() {
	return array(
		'hero'     => array(
			'eyebrow'         => 'Technology · Creativity · Community',
			'title'           => 'Empowering the next generation of',
			'title_accent'    => 'innovators in Africa.',
			'text'            => 'We are a growing community bridging the gap between talent and opportunity through technology, creativity, and social innovation.',
			'image_id'        => 0,
			'primary_label'   => 'Join the community',
			'primary_url'     => '#community',
			'secondary_label' => 'Our programs',
			'secondary_url'   => '#programs',
		),
		'mission'  => array(
			'about_eyebrow'  => 'Who we are',
			'about_title'    => "A home for Africa's next generation of makers.",
			'about_text'     => "LakeHub is an innovative non-profit organization dedicated to bridging the digital skills gap and creating a brighter, more equitable future for Africa's youth. Through decentralized learning and development programs, we provide accessible tech training, mentorship, and career pathways.",
			'about_image_id' => 0,
			'work_eyebrow'   => 'What we do',
			'work_title'     => 'Skills, opportunity, and local solutions.',
			'work_text'      => 'We train software engineers through a tuition-free, two-year full-time program, place graduates into global technology jobs, and actively fund local startups in Western Kenya. Our incubation, mentorship, and community programs lower barriers for entrepreneurs while building digital tools for regional industries.',
			'work_image_id'  => 0,
		),
		'journey'  => array(
			'eyebrow'    => 'Our journey',
			'title'      => 'From a small meet-up to a thriving force for innovation.',
			'intro'      => 'A decade of opening doors, nurturing talent, and growing a technology ecosystem from Western Kenya.',
			'milestones' => array(
				array( 'year' => '2013', 'title' => 'The spark', 'text' => 'Four founding members begin gathering local technologists.' ),
				array( 'year' => '2015', 'title' => 'Official hub', 'text' => 'LakeHub opens the first dedicated co-working space for creatives.' ),
				array( 'year' => '2020', 'title' => 'Expansion', 'text' => 'Programs grow across digital skills, gender inclusion, and incubation.' ),
				array( 'year' => 'Today', 'title' => 'Global impact', 'text' => "Western Kenya's talent connects to opportunities around the world." ),
			),
		),
		'partners' => array(
			'label' => 'Trusted by transformative partners',
			'items' => array(
				array( 'name' => 'GIZ German Cooperation', 'logo_id' => 0, 'url' => '' ),
				array( 'name' => 'Livelihood Impact Fund', 'logo_id' => 0, 'url' => '' ),
				array( 'name' => 'Partners for Equity Australia', 'logo_id' => 0, 'url' => '' ),
				array( 'name' => 'Segal Family Foundation', 'logo_id' => 0, 'url' => '' ),
				array( 'name' => 'African Visionary Fellowship', 'logo_id' => 0, 'url' => '' ),
			),
		),
		'insights' => array(
			'eyebrow'  => 'Ideas and stories',
			'title'     => 'Latest insights',
			'intro'     => "Stories of innovation, community progress, and the people moving Africa's technology ecosystem forward.",
			'post_ids'  => array(),
		),
		'cta'      => array(
			'title'        => 'Ideas no longer have to wait their turn.',
			'text'         => 'Join our network of innovators, mentors, and builders to turn your ideas into impact.',
			'button_label' => 'Explore programs',
			'button_url'   => 'mailto:info@lakehub.co.ke',
		),
	);
}

/**
 * Get a homepage section, merged with defaults.
 *
 * @param string $section Section name.
 * @param int    $post_id Optional page ID.
 * @return array<string, mixed>
 */
function lakehub_social_get_home_section( $section, $post_id = 0 ) {
	$defaults = lakehub_social_homepage_defaults();
	$fallback = isset( $defaults[ $section ] ) ? $defaults[ $section ] : array();
	$post_id  = $post_id ? absint( $post_id ) : absint( get_queried_object_id() );
	$saved    = $post_id ? get_post_meta( $post_id, '_lakehub_' . $section, true ) : array();

	return is_array( $saved ) ? array_replace_recursive( $fallback, $saved ) : $fallback;
}

/**
 * Get an editable site setting.
 *
 * @param string $key Setting key.
 * @return string
 */
function lakehub_social_get_site_setting( $key ) {
	$defaults = array(
		'tagline' => "Empowering Africa's next generation with the skills, resources, and community to build a more innovative future.",
		'address' => "Lake Basin Mall, Kisumu–Vihiga Road,\nKisumu, Kenya",
		'phone'   => '+254 748 902 779',
		'email'   => 'info@lakehub.co.ke',
		'footer_note' => 'Technology. Creativity. Community.',
	);
	$value = get_option( 'lakehub_social_' . $key, '' );
	return '' !== $value ? (string) $value : ( isset( $defaults[ $key ] ) ? $defaults[ $key ] : '' );
}

/**
 * Resolve a managed image with a bundled fallback.
 *
 * @param int    $attachment_id Attachment ID.
 * @param string $fallback      Theme-relative fallback filename.
 * @param string $alt           Fallback alt text.
 * @param array  $attributes    Extra image attributes.
 * @return string
 */
function lakehub_social_image( $attachment_id, $fallback, $alt, $attributes = array() ) {
	$attachment_id = absint( $attachment_id );
	if ( $attachment_id && wp_attachment_is_image( $attachment_id ) ) {
		$media_alt = get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );
		return wp_get_attachment_image( $attachment_id, 'full', false, array_merge( array( 'alt' => $media_alt ? $media_alt : $alt ), $attributes ) );
	}

	$attributes['src'] = get_theme_file_uri( 'assets/images/' . ltrim( $fallback, '/' ) );
	$attributes['alt'] = $alt;
	$html = '<img';
	foreach ( $attributes as $name => $value ) {
		$html .= sprintf( ' %s="%s"', esc_attr( $name ), esc_attr( $value ) );
	}
	return $html . '>';
}

/**
 * Estimate post reading time.
 *
 * @param int $post_id Post ID.
 * @return int
 */
function lakehub_social_reading_time( $post_id ) {
	$words = str_word_count( wp_strip_all_tags( (string) get_post_field( 'post_content', $post_id ) ) );
	return max( 1, (int) ceil( $words / 220 ) );
}

/**
 * Get the selected insight posts, falling back to the newest three.
 *
 * @param array<string, mixed> $settings Insight settings.
 * @return WP_Query
 */
function lakehub_social_insights_query( $settings ) {
	$ids  = isset( $settings['post_ids'] ) && is_array( $settings['post_ids'] ) ? array_slice( array_filter( array_map( 'absint', $settings['post_ids'] ) ), 0, 3 ) : array();
	$args = array(
		'post_type'           => 'post',
		'post_status'         => 'publish',
		'posts_per_page'      => 3,
		'ignore_sticky_posts' => true,
	);
	if ( $ids ) {
		$args['post__in'] = $ids;
		$args['orderby']  = 'post__in';
	}
	return new WP_Query( $args );
}

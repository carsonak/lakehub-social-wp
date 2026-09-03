<?php
/** Homepage defaults and frontend helpers. @package LakeHub_Social */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Return the Figma-aligned homepage defaults. */
function lakehub_social_homepage_defaults() {
	return array(
		'hero'     => array(
			'title'           => 'Empowering the next generation of',
			'title_accent'    => 'innovators',
			'title_tail'      => 'in Africa.',
			'text'            => 'We are a growing community bridging the gap between talent and opportunity through technology, creativity, and social investment.',
			'image_id'        => 0,
			'primary_label'   => 'Join the community',
			'primary_url'     => '#community',
			'secondary_label' => 'Our programs',
			'secondary_url'   => '/programs/',
		),
		'impact'   => array(
			'title'              => 'Impact through',
			'title_accent'       => 'Precision',
			'intro'              => 'We focus on measurable outcomes, leveraging data and community-driven initiatives to build sustainable tech ecosystems.',
			'incubator_image_id' => 0,
			'incubator_text'     => 'Incubating the next wave of tech startups in Western Kenya.',
			'incubator_label'    => 'Learn more',
			'incubator_url'      => '/programs/',
			'community_image_id' => 0,
			'programs_image_id'  => 0,
			'programs_text'      => "Whether it's through offering training in cutting-edge technologies, providing access to mentors and role models, or creating opportunities for young people to connect and collaborate with their peers, Lake Hub is committed to helping Africa's youth reach their full potential and contribute to the growth and progress of the continent.",
		),
		'journey'  => array(
			'title'      => 'Our Journey',
			'intro'      => 'From a small meetup to a driving force for innovation.',
			'milestones' => array(
				array( 'year' => '2013', 'title' => 'The Spark', 'text' => 'First meetups began in Kisumu, gathering local tech enthusiasts.' ),
				array( 'year' => '2015', 'title' => 'Official Hub', 'text' => 'Opened the first dedicated co-working space for creatives.' ),
				array( 'year' => '2019', 'title' => 'Expansion', 'text' => 'Launched dedicated coding bootcamps and incubators.' ),
				array( 'year' => 'PRESENT', 'title' => 'Global Impact', 'text' => 'Partnering internationally to drive sustainable tech solutions.' ),
			),
		),
		'partners' => array(
			'label' => 'Trusted by organizations globally',
			'items' => array(
				array( 'name' => 'GIZ', 'logo_id' => 0, 'logo_file' => 'partners/giz.svg', 'url' => 'https://www.giz.de/en/' ),
				array( 'name' => 'Livelihood Impact Fund', 'logo_id' => 0, 'logo_file' => 'partners/livelihood.png', 'url' => 'https://www.livelihoodimpactfund.org/' ),
				array( 'name' => 'Partners for Equity Australia', 'logo_id' => 0, 'logo_file' => 'partners/pfe.png', 'url' => 'https://partnersforequity.org/' ),
				array( 'name' => 'German Cooperation', 'logo_id' => 0, 'logo_file' => 'partners/german-cooperation.png', 'url' => 'https://www.giz.de/en/' ),
				array( 'name' => 'African Visionary Fellowship', 'logo_id' => 0, 'logo_file' => 'partners/avf.svg', 'url' => 'https://www.segalfamilyfoundation.org/our-partners/african-visionary-fellowship/' ),
			),
		),
		'insights' => array(
			'title' => 'Latest Insights',
			'intro' => 'Stories of innovation and community progress.',
		),
		'cta'      => array(
			'title'        => 'Ideas no longer have to wait their turn.',
			'text'         => 'Join our network of innovators, mentors, and investors to turn your vision into impact.',
			'button_label' => 'Explore programs',
			'button_url'   => '/programs/',
		),
	);
}

/** Get one homepage section, merging saved v2 content with its defaults. */
function lakehub_social_get_home_section( $section, $post_id = 0 ) {
	$defaults = lakehub_social_homepage_defaults();
	$fallback = isset( $defaults[ $section ] ) ? $defaults[ $section ] : array();
	$post_id  = $post_id ? absint( $post_id ) : absint( get_queried_object_id() );
	$saved    = $post_id ? get_post_meta( $post_id, '_lakehub_v2_' . $section, true ) : array();
	return is_array( $saved ) ? array_replace_recursive( $fallback, $saved ) : $fallback;
}

/** Resolve a site-wide editable setting. */
function lakehub_social_get_site_setting( $key ) {
	$defaults = array(
		'linkedin_url' => '',
		'facebook_url' => '',
		'x_url'        => '',
		'privacy_url'  => '',
		'contact_url'  => 'mailto:info@lakehub.co.ke',
	);
	$value = get_option( 'lakehub_social_' . $key, '' );
	return '' !== $value ? (string) $value : ( isset( $defaults[ $key ] ) ? $defaults[ $key ] : '' );
}

/** Resolve a managed image with a bundled Figma fallback. */
function lakehub_social_image( $attachment_id, $fallback, $alt, $attributes = array() ) {
	$attachment_id = absint( $attachment_id );
	if ( $attachment_id && wp_attachment_is_image( $attachment_id ) ) {
		$media_alt = get_post_meta( $attachment_id, '_wp_attachment_image_alt', true );
		return wp_get_attachment_image( $attachment_id, 'full', false, array_merge( array( 'alt' => $media_alt ? $media_alt : $alt ), $attributes ) );
	}
	$attributes['src'] = get_theme_file_uri( 'assets/images/' . ltrim( $fallback, '/' ) );
	$attributes['alt'] = $alt;
	$html              = '<img';
	foreach ( $attributes as $name => $value ) {
		$html .= sprintf( ' %s="%s"', esc_attr( $name ), esc_attr( $value ) );
	}
	return $html . '>';
}

/** Query exactly the newest three published Insights. */
function lakehub_social_insights_query() {
	return new WP_Query(
		array(
			'post_type'           => 'post',
			'post_status'         => 'publish',
			'posts_per_page'      => 3,
			'orderby'             => 'date',
			'order'               => 'DESC',
			'ignore_sticky_posts' => true,
		)
	);
}

/** Render a post thumbnail, with bundled originals for the three initial Figma Insights. */
function lakehub_social_insight_image( $post_id ) {
	if ( has_post_thumbnail( $post_id ) ) {
		return get_the_post_thumbnail( $post_id, 'large', array( 'loading' => 'lazy' ) );
	}
	$fallbacks = array(
		'zone01-kisumu-and-nationdev-sign-mou'       => 'insight-zone01.png',
		'closing-the-gender-parity-in-technology'    => 'insight-gender.png',
		'italanta-hackathon-2024'                     => 'insight-italanta.png',
	);
	$slug = get_post_field( 'post_name', $post_id );
	return isset( $fallbacks[ $slug ] ) ? lakehub_social_image( 0, $fallbacks[ $slug ], get_the_title( $post_id ), array( 'loading' => 'lazy' ) ) : '';
}

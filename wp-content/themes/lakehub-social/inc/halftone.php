<?php
/**
 * Halftone pattern attributes and editor integration for the LakeHub Social theme.
 *
 * @package LakeHub_Social
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Enqueue block editor controls for halftone patterns.
add_action( 'enqueue_block_editor_assets', static function () {
	$editor_js = get_theme_file_path( 'assets/js/halftone-editor.js' );
	if ( file_exists( $editor_js ) ) {
		wp_enqueue_script(
			'lakehub-halftone-editor',
			get_theme_file_uri( 'assets/js/halftone-editor.js' ),
			array( 'wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-compose', 'wp-hooks', 'wp-i18n' ),
			filemtime( $editor_js ),
			true
		);
	}
} );

// Render halftone pattern attributes on core/image blocks.
add_filter( 'render_block_core/image', static function ( $block_content, $block ) {
	$attrs     = $block['attrs'] ?? array();
	$template  = $attrs['lakehubHalftoneTemplate'] ?? '';
	$spread    = isset( $attrs['lakehubHalftoneSpread'] ) ? (float) $attrs['lakehubHalftoneSpread'] : 60;
	$max_dot   = isset( $attrs['lakehubHalftoneMaxDot'] ) ? (float) $attrs['lakehubHalftoneMaxDot'] : 7.5;
	$shrink    = isset( $attrs['lakehubHalftoneShrink'] ) ? (float) $attrs['lakehubHalftoneShrink'] : 0.88;
	$color     = $attrs['lakehubHalftoneColor'] ?? '#00676B';
	$scale     = isset( $attrs['lakehubHalftoneContainerScale'] ) ? (float) $attrs['lakehubHalftoneContainerScale'] : 1.25;
	$spacing   = isset( $attrs['lakehubHalftoneSpacing'] ) ? (float) $attrs['lakehubHalftoneSpacing'] : 16;
	$placement = $attrs['lakehubHalftonePlacement'] ?? '';
	$offset_x  = isset( $attrs['lakehubHalftoneOffsetX'] ) ? (float) $attrs['lakehubHalftoneOffsetX'] : 0;
	$offset_y  = isset( $attrs['lakehubHalftoneOffsetY'] ) ? (float) $attrs['lakehubHalftoneOffsetY'] : 0;

	$class_name      = $attrs['className'] ?? '';
	$is_style_photo  = str_contains( $class_name, 'is-style-lakehub-story-photo' )
		|| str_contains( $class_name, 'is-style-lakehub-community-photo' )
		|| str_contains( $class_name, 'is-style-lakehub-portfolio-photo' );

	if ( empty( $template ) && $is_style_photo ) {
		$template = 'rectangular';
	}

	if ( 'bottom-left' === $placement ) {
		$offset_x = -35;
		$offset_y = 35;
	} elseif ( 'top-left' === $placement ) {
		$offset_x = -35;
		$offset_y = -35;
	} elseif ( 'bottom-right' === $placement ) {
		$offset_x = 35;
		$offset_y = 25;
	} elseif ( 'top-right' === $placement ) {
		$offset_x = 35;
		$offset_y = -35;
	} elseif ( 'center' === $placement ) {
		$offset_x = 0;
		$offset_y = 0;
	} elseif ( empty( $placement ) ) {
		if ( str_contains( $class_name, 'is-style-lakehub-story-photo' ) ) {
			$offset_x = -35;
			$offset_y = 35;
		} elseif ( str_contains( $class_name, 'is-style-lakehub-community-photo' ) ) {
			$offset_x = -35;
			$offset_y = -35;
		} elseif ( str_contains( $class_name, 'is-style-lakehub-portfolio-photo' ) ) {
			$offset_x = 35;
			$offset_y = 25;
		}
	}

	if ( empty( $template ) || 'none' === $template ) {
		return $block_content;
	}

	$tags = new WP_HTML_Tag_Processor( $block_content );
	if ( $tags->next_tag( array( 'tag_name' => 'figure' ) ) ) {
		$tags->set_attribute( 'data-lakehub-halftone', esc_attr( $template ) );
		$tags->set_attribute( 'data-lakehub-halftone-scale', esc_attr( (string) $scale ) );
		$tags->set_attribute( 'data-lakehub-halftone-spacing', esc_attr( (string) $spacing ) );
		$tags->set_attribute( 'data-lakehub-halftone-spread', esc_attr( (string) $spread ) );
		$tags->set_attribute( 'data-lakehub-halftone-max-dot', esc_attr( (string) $max_dot ) );
		$tags->set_attribute( 'data-lakehub-halftone-shrink', esc_attr( (string) $shrink ) );
		$tags->set_attribute( 'data-lakehub-halftone-color', esc_attr( $color ) );
		$tags->set_attribute( 'data-lakehub-halftone-offset-x', esc_attr( (string) $offset_x ) );
		$tags->set_attribute( 'data-lakehub-halftone-offset-y', esc_attr( (string) $offset_y ) );
		$tags->add_class( 'lakehub-has-halftone' );
		return $tags->get_updated_html();
	}
	return $block_content;
}, 10, 2 );

/**
 * LakeHub Social - Block Editor Controls for Dynamic Halftone Patterns
 *
 * Extends core/image blocks with a Block Inspector panel to configure:
 * - Halftone Template (Rectangular Concentric, Circular Concentric, or None)
 * - Spread beyond image frame (default 60px)
 * - Central max dot size (default 7.5px)
 * - Ring shrink factor (default 0.88)
 * - Dot color picker (default #00676B)
 *
 * Spacing between dots is fixed at 20px (non-configurable).
 *
 * @package LakeHub_Social
 */

(function (wp) {
  'use strict';

  if (!wp || !wp.blocks || !wp.element || !wp.blockEditor || !wp.components || !wp.compose || !wp.hooks) {
    return;
  }

  const { addFilter } = wp.hooks;
  const { createHigherOrderComponent } = wp.compose;
  const { Fragment, createElement: el } = wp.element;
  const { InspectorControls } = wp.blockEditor;
  const { PanelBody, SelectControl, RangeControl, ColorPalette, BaseControl } = wp.components;
  const { __ } = wp.i18n || { __: function (s) { return s; } };

  /**
   * 1. Register custom attributes on core/image
   */
  addFilter(
    'blocks.registerBlockType',
    'lakehub/halftone-attributes',
    function (settings, name) {
      if (name !== 'core/image') {
        return settings;
      }
      return Object.assign({}, settings, {
        attributes: Object.assign({}, settings.attributes, {
          lakehubHalftoneTemplate: {
            type: 'string',
            default: '',
          },
          lakehubHalftoneSpread: {
            type: 'number',
            default: 60,
          },
          lakehubHalftoneMaxDot: {
            type: 'number',
            default: 7.5,
          },
          lakehubHalftoneShrink: {
            type: 'number',
            default: 0.88,
          },
          lakehubHalftoneColor: {
            type: 'string',
            default: '#00676B',
          },
        }),
      });
    }
  );

  /**
   * 2. Extend BlockEdit for core/image with InspectorControls panel
   */
  const withHalftoneControls = createHigherOrderComponent(function (BlockEdit) {
    return function (props) {
      if (props.name !== 'core/image') {
        return el(BlockEdit, props);
      }

      const attributes = props.attributes || {};
      const setAttributes = props.setAttributes;
      const {
        lakehubHalftoneTemplate = '',
        lakehubHalftoneSpread = 60,
        lakehubHalftoneMaxDot = 7.5,
        lakehubHalftoneShrink = 0.88,
        lakehubHalftoneColor = '#00676B',
      } = attributes;

      const templateOptions = [
        { label: __('Default (Inherit from photo style)', 'lakehub-social'), value: '' },
        { label: __('Rectangular Concentric Rings', 'lakehub-social'), value: 'rectangular' },
        { label: __('Circular Concentric Rings', 'lakehub-social'), value: 'circular' },
        { label: __('None / Disabled', 'lakehub-social'), value: 'none' },
      ];

      const colorPaletteColors = [
        { name: __('LakeHub Teal', 'lakehub-social'), color: '#00676B' },
        { name: __('Deep Teal', 'lakehub-social'), color: '#004F52' },
        { name: __('LakeHub Orange', 'lakehub-social'), color: '#F15A24' },
        { name: __('Dark Charcoal', 'lakehub-social'), color: '#1E1E1E' },
        { name: __('Light Gray', 'lakehub-social'), color: '#E0E0E0' },
        { name: __('White', 'lakehub-social'), color: '#FFFFFF' },
      ];

      const isEnabled = lakehubHalftoneTemplate !== 'none';

      return el(
        Fragment,
        {},
        el(BlockEdit, props),
        el(
          InspectorControls,
          {},
          el(
            PanelBody,
            {
              title: __('Halftone Pattern Settings', 'lakehub-social'),
              initialOpen: true,
            },
            el(SelectControl, {
              label: __('Halftone Pattern Template', 'lakehub-social'),
              value: lakehubHalftoneTemplate,
              options: templateOptions,
              help: __(
                'Select a concentric halftone template. Spacing between dots is fixed at 16px.',
                'lakehub-social'
              ),
              onChange: function (value) {
                setAttributes({ lakehubHalftoneTemplate: value });
              },
            }),
            isEnabled &&
              el(RangeControl, {
                label: __('Pattern Spread Beyond Frame (px)', 'lakehub-social'),
                value: lakehubHalftoneSpread !== undefined ? lakehubHalftoneSpread : 60,
                min: 10,
                max: 150,
                step: 5,
                help: __('Distance the halftone pattern extends outside the photo frame. Default is 60px.', 'lakehub-social'),
                onChange: function (value) {
                  setAttributes({ lakehubHalftoneSpread: value });
                },
              }),
            isEnabled &&
              el(RangeControl, {
                label: __('Center Max Dot Size (px)', 'lakehub-social'),
                value: lakehubHalftoneMaxDot !== undefined ? lakehubHalftoneMaxDot : 7.5,
                min: 2,
                max: 20,
                step: 0.5,
                help: __('Diameter/radius of dots at the center. Default is 7.5px.', 'lakehub-social'),
                onChange: function (value) {
                  setAttributes({ lakehubHalftoneMaxDot: value });
                },
              }),
            isEnabled &&
              el(RangeControl, {
                label: __('Ring Shrink Factor', 'lakehub-social'),
                value: lakehubHalftoneShrink !== undefined ? lakehubHalftoneShrink : 0.88,
                min: 0.6,
                max: 0.98,
                step: 0.01,
                help: __('Rate at which dot size shrinks per ring outward. Lower values fade faster. Default is 0.88.', 'lakehub-social'),
                onChange: function (value) {
                  setAttributes({ lakehubHalftoneShrink: value });
                },
              }),
            isEnabled &&
              el(
                BaseControl,
                {
                  label: __('Dot Color', 'lakehub-social'),
                  help: __('Choose the color for the halftone dots. Default is Teal (#00676B).', 'lakehub-social'),
                },
                el(ColorPalette, {
                  colors: colorPaletteColors,
                  value: lakehubHalftoneColor || '#00676B',
                  onChange: function (value) {
                    setAttributes({ lakehubHalftoneColor: value || '#00676B' });
                  },
                })
              )
          )
        )
      );
    };
  }, 'withHalftoneControls');

  addFilter('editor.BlockEdit', 'lakehub/halftone-controls', withHalftoneControls);
})(window.wp);

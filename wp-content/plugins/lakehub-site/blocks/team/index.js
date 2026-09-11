(function (wp) {
  const el = wp.element.createElement;
  const __ = wp.i18n.__;
  wp.blocks.registerBlockType('lakehub/team', {
    edit: function (props) {
      return el('div', wp.blockEditor.useBlockProps(),
        el(wp.blockEditor.InspectorControls, {},
          el(wp.components.PanelBody, {title: __('Team display', 'lakehub-site')},
            el(wp.components.ToggleControl, {label: __('Featured members only', 'lakehub-site'), checked: props.attributes.featuredOnly, onChange: featuredOnly => props.setAttributes({featuredOnly})}),
            el(wp.components.RangeControl, {label: __('Member limit (0 shows all)', 'lakehub-site'), min: 0, max: 100, value: props.attributes.limit, onChange: limit => props.setAttributes({limit})}))),
        el(wp.components.Notice, {status: 'info', isDismissible: false},
          el('a', {href: 'edit.php?post_type=lakehub_team_member', target: '_blank', rel: 'noopener'}, __('Manage team members', 'lakehub-site'))),
        el(wp.serverSideRender.default || wp.serverSideRender, {block: 'lakehub/team', attributes: props.attributes, httpMethod: 'POST'})
      );
    },
    save: function () { return null; }
  });
})(window.wp);

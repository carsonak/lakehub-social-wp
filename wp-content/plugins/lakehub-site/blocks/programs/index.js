(function (wp) {
  const el = wp.element.createElement;
  const __ = wp.i18n.__;
  wp.blocks.registerBlockType('lakehub/programs', {
    edit: function (props) {
      return el('div', wp.blockEditor.useBlockProps(),
        el(wp.components.Notice, { status: 'info', isDismissible: false },
          __('Edit program descriptions, photos, links, and order under Programs.', 'lakehub-site'), ' ',
          el('a', { href: 'edit.php?post_type=program', target: '_blank', rel: 'noopener' }, __('Manage programs', 'lakehub-site'))),
        el(wp.serverSideRender.default || wp.serverSideRender, { block: 'lakehub/programs', attributes: props.attributes, httpMethod: 'POST' })
      );
    },
    save: function () { return null; }
  });
})(window.wp);

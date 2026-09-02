(() => {
  const root = document.querySelector('#lakehub-homepage-content');
  if (!root || !window.wp?.media) return;

  const reindex = (repeater) => {
    [...repeater.querySelectorAll(':scope > .lakehub-repeater-row')].forEach((row, index) => {
      row.querySelectorAll('[name]').forEach((field) => {
        field.name = field.name.replace(/\[(milestones|items)\]\[[^\]]+\]/, `[$1][${index}]`);
      });
    });
  };

  root.addEventListener('click', (event) => {
    const selectButton = event.target.closest('.lakehub-select-media');
    if (selectButton) {
      event.preventDefault();
      const field = selectButton.closest('.lakehub-media-field');
      const frame = wp.media({ title: 'Choose an image', button: { text: 'Use this image' }, library: { type: 'image' }, multiple: false });
      frame.on('select', () => {
        const image = frame.state().get('selection').first().toJSON();
        field.querySelector('.lakehub-media-id').value = image.id;
        field.querySelector('.lakehub-media-preview').innerHTML = `<img src="${image.sizes?.thumbnail?.url || image.url}" alt="">`;
      });
      frame.open();
      return;
    }

    const removeMedia = event.target.closest('.lakehub-remove-media');
    if (removeMedia) {
      event.preventDefault();
      const field = removeMedia.closest('.lakehub-media-field');
      field.querySelector('.lakehub-media-id').value = '';
      field.querySelector('.lakehub-media-preview').replaceChildren();
      return;
    }

    const addButton = event.target.closest('.lakehub-add-row');
    if (addButton) {
      event.preventDefault();
      const template = document.getElementById(addButton.dataset.template);
      const repeater = addButton.previousElementSibling;
      const index = repeater.querySelectorAll(':scope > .lakehub-repeater-row').length;
      const wrapper = document.createElement('div');
      wrapper.innerHTML = template.innerHTML.replaceAll('__INDEX__', String(index));
      repeater.append(...wrapper.children);
      reindex(repeater);
      return;
    }

    const row = event.target.closest('.lakehub-repeater-row');
    if (!row) return;
    const repeater = row.parentElement;
    if (event.target.closest('.lakehub-remove-row')) {
      event.preventDefault(); row.remove(); reindex(repeater);
    } else if (event.target.closest('.lakehub-move-up') && row.previousElementSibling) {
      event.preventDefault(); repeater.insertBefore(row, row.previousElementSibling); reindex(repeater);
    } else if (event.target.closest('.lakehub-move-down') && row.nextElementSibling) {
      event.preventDefault(); repeater.insertBefore(row.nextElementSibling, row); reindex(repeater);
    }
  });
})();

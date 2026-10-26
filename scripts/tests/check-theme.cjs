/** Syntax, local asset paths, and frontend/editor loading of modular CSS. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const postcss = require('postcss');
const root = 'wp-content/themes/lakehub-social';
const enqueue = fs.readFileSync(`${root}/inc/enqueue.php`, 'utf8');
for (const file of fs.readdirSync(`${root}/assets/css`).filter((file) => file.endsWith('.css'))) {
  const relative = `assets/css/${file}`;
  const css = postcss.parse(fs.readFileSync(`${root}/${relative}`, 'utf8'));
  assert(enqueue.split(relative).length >= 3, `${relative} must load in frontend and editor`);
  css.walkDecls((decl) => {
    for (const match of decl.value.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
      if (/^(data:|https?:|#)/.test(match[1])) continue;
      assert(fs.existsSync(path.resolve(root, 'assets/css', match[1])), `${file}: missing ${match[1]}`);
    }
  });
}
for (const folder of ['assets/js', 'assets/js/modules']) {
  for (const file of fs.readdirSync(`${root}/${folder}`).filter((file) => file.endsWith('.js'))) {
    new vm.Script(fs.readFileSync(`${root}/${folder}/${file}`, 'utf8'), { filename: file });
    assert(enqueue.includes(`${folder}/${file}`) || file === 'halftone-editor.js', `${file} has no enqueue`);
  }
}
console.log('Theme syntax, CSS loading and local CSS asset references pass.');

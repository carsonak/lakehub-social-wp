# Photo hero parity

- [x] Restore each frame's original size/weight/line-height from cached context.
- [x] Match desktop heading geometry and button separation without changing saved blocks.
- [x] Verify responsive fit, desktop reference measurements and visual captures.
- [x] Finish conventional implementation checkpoint and full-site backup.

At 1280px: Home 76/70px at (286,140) within a 538px cover; Programs 56/70px with heading y=188 in a 572px cover; About 56/56px at x=108, y=186.5, width=1064; Impact 56/52px at x=299, y=166, width=672 in a 480px cover. Coordinates are relative to each cover. Original 800/800/700/700 weights restored. All four desktop captures visually reviewed.

Five responsive widths passed (1440,1024,768,390,320); the desktop check initially caught a two-pixel outline-border contribution, which was fixed along with the Programs button line-height. The 1280px recheck then passed. Static theme and PHP enqueue syntax checks pass. Full final regression suite follows phase 03.

Desktop placement uses existing Cover/Heading/Button blocks in flow, shared presets and per-page theme tokens. No markup, database, JavaScript, photo or content changes. Existing Home accent and slideshow remain. The full phase export is `.backups/figma-hero-fix.zip`.

Checkpoint `d459a08 fix(theme): restore Figma hero typography and alignment` pushed successfully. Full export backed up through the usual script at `studio-exports/lakehub-social-studio-20261028T230603Z.zip` and latest, with checksum/manifest.

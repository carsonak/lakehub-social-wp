# LakeHub Social WordPress project

## Project baseline

- This repository is a complete WordPress 7.1 site backed by MySQL. Run WP-CLI from the repository root with `wp --path="$PWD" ...`.
- The active theme is `wp-content/themes/lakehub-social` 2.0.0. It is currently a classic PHP theme.
- Active plugins at this baseline are Advanced Custom Fields 6.8.9, MCP Adapter 0.6.1, Starter Templates 4.7.5, and WSP MCP - AI Agents Connector 2.7.1.
- Treat WordPress core and third-party plugins as vendor code. Do not edit them unless the task explicitly targets them. Preserve unrelated worktree changes.

## Architecture direction

- Migration to a block theme is decided future work, not an open design choice. Move toward `theme.json`, `templates/*.html`, `parts/*.html`, native blocks, and filesystem patterns under `patterns/*.php`.
- Keep canonical templates, parts, patterns, tokens, and shipped defaults in Git. If a layout is prototyped in the Site Editor, export it to theme files; do not leave the only canonical copy as a database override.
- Keep presentation in the theme. Put new custom post types, taxonomies, data migrations, scheduled tasks, and other site functionality in a project-owned plugin.
- Prefer native blocks before custom blocks. Use an unsynced pattern for a reusable layout whose copies need independent content, such as cards. Use a synced pattern only when every occurrence should share content.
- Protect design structure with content-only or structural locking when appropriate, while keeping text, images, links, and repeatable content editable for non-technical users.
- Use a content type plus Query Loop or a focused dynamic block for repeated collections. Do not hard-code repeatable client content into templates.
- Use ACF only when native block/editor controls cannot provide a clear editing experience. Store field definitions in a project-owned `acf-json/` directory or PHP registration so they are versioned in Git.

## Figma is the design source of truth

- Golden reference: https://www.figma.com/design/w9CKeLbqHoTXQczTCfsyyi/LakeHub-production?node-id=134-3&t=AVlCQfTd5xzAoiHq-1
- Before implementing a Figma-derived page or component, use the Figma design-context workflow on the exact target node. Inspect smaller child nodes when the parent response lacks responsive, asset, or component detail.
- Treat generated React/Tailwind output as design reference, not code to paste. Adapt structure and behavior to WordPress blocks, templates, patterns, and the project styling system.
- Translate Figma color, typography, spacing, layout, and responsive values into reusable `theme.json` presets and block styles. Avoid one-off values when a shared token applies.
- Download exact images and SVGs promptly into project-owned assets or the Media Library as appropriate. Figma asset URLs expire and must never be committed as durable sources.
- Validate desktop and responsive rendering against Figma. Preserve semantic headings, keyboard operation, focus visibility, useful alternative text, contrast, and reduced-motion behavior.

## Editing and security rules

- Optimize admin experiences for a client with little coding knowledge. Prefer direct block controls, featured images, menus, settings, and clear repeaters over raw HTML or code fields.
- Follow WordPress coding conventions. Sanitize and validate input, escape output at the final context, use nonces for CSRF protection, and enforce capability checks for authorization.
- Preserve stable block names and saved markup. When changing a static block's serialization, add a deprecation/migration path and verify that saved content reloads without block recovery.
- Keep bundled design assets local. Do not introduce placeholder URLs, remote hotlinks, or hand-drawn replacements for supplied Figma assets.

## Git and backup workflow

- Git stores source: WordPress core, themes, plugins, `.codex/skills/`, and this file.
- Cloudflare R2 stores MySQL dumps and `wp-content/uploads/`. `.env`, `.runtime/`, `.backups/`, caches, logs, and WordPress upgrade work directories remain local and ignored.
- First setup: copy `.env.example` to `.env`, fill it, restrict its permissions, then run `./scripts/setup.sh`.
- Pull/restore: start from a clean worktree and run `./scripts/pull.sh`. It fast-forwards Git, creates a local rollback dump, imports the latest R2 MySQL dump, and copies uploads without local deletion.
- Push/backup: stage intended source and run `./scripts/push.sh "commit message"`. It auto-stages only `.codex/skills/` and `AGENTS.md`, commits the full index, backs up MySQL/uploads to R2, and pushes the current branch.
- Do not run pull, push, commit, install/update, import, search-replace, or other externally visible/destructive operations unless the user requested that operation.
- Before committing, review `git status --short`, `git diff`, and `git diff --cached`. `git add .` excludes ignored runtime/R2 data but still stages modifications to every already-tracked file.

## WP-CLI safety

- Confirm the target is this local site before writes. Use `--path="$PWD"`; use `--url=` as well if multisite is ever enabled.
- Back up MySQL before risky writes. Run `wp search-replace --dry-run` before applying URL changes. Treat database imports/resets, bulk deletes, and mass updates as destructive.
- Prefer repeatable WP-CLI commands for seeding or manipulating content. Verify the resulting content in wp-admin and on the frontend, and keep structural defaults represented in source where practical.

## Verification baseline

- Project PHP syntax: `find wp-content/themes/lakehub-social -type f -name '*.php' -print0 | xargs -0 -n1 php -l`.
- Backup scripts: `bash -n scripts/setup.sh scripts/push.sh scripts/pull.sh scripts/lib/common.sh` and `shellcheck scripts/setup.sh scripts/push.sh scripts/pull.sh scripts/lib/common.sh`.
- Runtime health: `wp --path="$PWD" db check`, `wp --path="$PWD" theme list`, and `wp --path="$PWD" plugin list`.
- For block work, insert in the editor, save, reload, and confirm there is no validation/recovery warning. Verify frontend/editor parity, content editability, responsive layouts, keyboard access, and the relevant Figma screenshot before completion.
- Prefer existing project tooling. Node.js 20.18+ with npm/npx is required before using the installed Node-based WordPress scanners, block build tools, Playground, or browser tests.

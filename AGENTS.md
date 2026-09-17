# LakeHub Social WordPress project

## Project baseline

- This repository is the canonical WordPress Studio site: WordPress 7.1, Studio's native PHP runtime, and SQLite at `wp-content/database/.ht.sqlite`. Manage it from Studio; for rare diagnostics and migrations run `studio wp --path="$PWD" ...` from the repository root.
- The active theme is `wp-content/themes/lakehub-social` 3.2.3, a native block theme. Home and Programs contain editable section blocks.
- Active plugins at this baseline are Advanced Custom Fields 6.8.10, Mailchimp for WordPress 4.14.1, MCP Adapter 0.6.1, WSP MCP - AI Agents Connector 2.8.0, and project-owned LakeHub Site 1.2.1.
- Treat WordPress core and third-party plugins as vendor code. Do not edit them unless the task explicitly targets them. Preserve unrelated worktree changes.

## Architecture direction

- Maintain the block theme using `theme.json`, `templates/*.html`, `parts/*.html`, native blocks, and filesystem patterns under `patterns/*.php`. See `docs/editing-guide.md` and `docs/block-migration.md`.
- LakeHub Site owns the existing `program` content type and `lakehub/programs` block. Content migrations are explicit Studio WP-CLI commands (`studio wp --path="$PWD" lakehub blocks migrate --dry-run`); never seed or overwrite content on admin visits.
- Keep canonical templates, parts, patterns, tokens, and shipped defaults in Git. If a layout is prototyped in the Site Editor, export it to theme files; do not leave the only canonical copy as a database override.
- Keep presentation in the theme. Put new custom post types, taxonomies, data migrations, scheduled tasks, and other site functionality in a project-owned plugin.
- Prefer native blocks before custom blocks. Use an unsynced pattern for a reusable layout whose copies need independent content, such as cards. Use a synced pattern only when every occurrence should share content.
- Protect design structure with content-only or structural locking when appropriate, while keeping text, images, links, and repeatable content editable for non-technical users.
- Use a content type plus Query Loop or a focused dynamic block for repeated collections. Do not hard-code repeatable client content into templates.
- Use ACF only when native block/editor controls cannot provide a clear editing experience. Store field definitions in a project-owned `acf-json/` directory or PHP registration so they are versioned in Git.

## Figma is the design source of truth

- Before implementing a Figma-derived page or component, use the Figma design-context workflow on the exact target node. Inspect smaller child nodes when the parent response lacks responsive, asset, or component detail.
- If Figma MCP access is unavailable, use current exports of the exact approved frames as the design reference: PNG for visual comparison, SVG with text preserved for inspection, and separate original assets where needed. Record export provenance and unresolved measurements in project documentation. Cached context is supporting evidence; do not treat it as confirmation that an updated frame is unchanged. Resume MCP inspection when available without making quota restoration a prerequisite for an adequately documented export-based implementation.
- Treat generated React/Tailwind output as design reference, not code to paste. Adapt structure and behavior to WordPress blocks, templates, patterns, and the project styling system.
- Translate Figma color, typography, spacing, layout, and responsive values into reusable `theme.json` presets and block styles. Avoid one-off values when a shared token applies.
- Download exact images and SVGs promptly into project-owned assets or the Media Library as appropriate. Figma asset URLs expire and must never be committed as durable sources.
- Validate desktop and responsive rendering against Figma. Preserve semantic headings, keyboard operation, focus visibility, useful alternative text, contrast, and reduced-motion behavior.

## Editing and security rules

- Optimize admin experiences for a client with little coding knowledge. Prefer direct block controls, featured images, menus, settings, and clear repeaters over raw HTML or code fields.
- Follow WordPress coding conventions. Sanitize and validate input, escape output at the final context, use nonces for CSRF protection, and enforce capability checks for authorization.
- Preserve stable block names and saved markup. When changing a static block's serialization, add a deprecation/migration path and verify that saved content reloads without block recovery.
- Keep bundled design assets local. Do not introduce placeholder URLs, remote hotlinks, or hand-drawn replacements for supplied Figma assets.

## Task planning and phase backup workflow

- Before executing non-trivial feature, review, or design tasks, create a detailed implementation plan artifact outlining the scope, architectural strategy, component diffs, and verification matrix. Solicit user review and approval before making modifying code or database changes.
- Break multi-part work into discrete, ordered phases tracked in `docs/tasks/<task-group>/` with a master `README.md` status table and individual task checklists (`- [ ]` / `- [x]`).
- Back up and mark progress after every phase:
  - Immediately upon completing each phase, mark its checklist items as complete (`- [x]`) and update the master task status table.
  - Run the phase verification checks (PHP linting, script validation, and relevant automated browser tests).
  - Review `git status --short` and record a clean, atomic Git commit for that phase's changes so progress is preserved and durably checkpointed in Git history. Never batch multiple distinct phases into a single uncheckpointed commit.

## Git and backup workflow

- Use WordPress Studio to manage this repository as the canonical local site. Studio owns the ignored `wp-config.php`, SQLite drop-in/integration, local database, runtime, and temporary preview packaging.
- Before starting or importing the site in Studio, verify the repository path and local URL. Do not create a second canonical site or add MySQL credentials back to `wp-config.php` or `.env`.
- Keep changing design frame links and implementation status in project documentation, not in this file. See `docs/design-refresh.md` for the design references and refresh requirements.

- Git stores source: WordPress core, themes, plugins, `.codex/skills/`, and this file.
- Cloudflare R2 stores full WordPress Studio exports (SQLite SQL plus `wp-content`) under `studio-exports/`; Git remains the source of truth for tracked code. `.env`, `.runtime/`, `.backups/`, Studio database/drop-in files, caches, logs, and WordPress upgrade work directories remain local and ignored.
- First setup: copy `.env.example` to `.env`, fill the R2 values, restrict its permissions, and run `./scripts/setup.sh`. Import the downloaded archive through Studio's **Add site → Import from a backup** flow using this repository as the site directory.
- Pull/restore: start from a clean worktree and run `./scripts/pull.sh`. It fast-forwards Git and downloads and validates the latest full Studio export, but deliberately leaves the destructive import to the Studio UI.
- Push/backup: first make a **Full site** export in Studio. Stage intended source, then run `./scripts/push.sh "commit message" /absolute/path/to/studio-export.zip`. It validates and uploads the export and checksum as both timestamped and latest R2 objects, retains the newest five timestamped exports, commits the existing index (plus project-owned agent instructions), and pushes the current branch.
- Do not run pull, push, commit, install/update, import, search-replace, or other externally visible/destructive operations unless the user requested that operation.
- Before committing, review `git status --short`, `git diff`, and `git diff --cached`. `git add .` excludes ignored runtime/R2 data but still stages modifications to every already-tracked file.

## Studio and WP-CLI safety

- Confirm the Studio target is this repository before writes. Use `studio wp --path="$PWD"`; use `--url=` as well if multisite is ever enabled.
- Make a full Studio export before risky writes. Run `studio wp --path="$PWD" search-replace --dry-run` before applying URL changes. Treat imports, resets, bulk deletes, and mass updates as destructive.
- Prefer Studio's GUI for lifecycle, import/export, and preview management. Use repeatable Studio WP-CLI commands for project-owned content migrations, then verify the editor and frontend.

## Verification baseline

- Project PHP syntax: `find wp-content/themes/lakehub-social wp-content/plugins/lakehub-site -type f -name '*.php' -print0 | xargs -0 -n1 php -l`.
- Backup scripts: `bash -n scripts/setup.sh scripts/push.sh scripts/pull.sh scripts/lib/common.sh` and `shellcheck scripts/setup.sh scripts/push.sh scripts/pull.sh scripts/lib/common.sh`.
- Runtime health: `studio status`, `studio wp --path="$PWD" core version`, `studio wp --path="$PWD" theme list`, and `studio wp --path="$PWD" plugin list`. Do not use `wp db check`; it invokes MySQL tooling and is not a valid SQLite health check.
- For block work, insert in the editor, save, reload, and confirm there is no validation/recovery warning. Verify frontend/editor parity, content editability, responsive layouts, keyboard access, and the relevant Figma screenshot before completion.
- Prefer existing project tooling. Node.js 20.18+ with npm/npx is required before using the installed Node-based WordPress scanners, block build tools, Playground, or browser tests.

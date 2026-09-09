# Home and Programs design refresh

## Approved direction

Update the existing native block theme to match the approved Figma layouts, colours, typography, copy, and imagery. This is development content: Figma defaults may replace the affected page content after a database backup. Preserve page IDs, slugs, unrelated content, and program destinations unless the approved design explicitly changes them.

- [Home, 615:348](https://www.figma.com/design/w9CKeLbqHoTXQczTCfsyyi/LakeHub-production?node-id=615-348)
- [Our Programs, 299:174](https://www.figma.com/design/w9CKeLbqHoTXQczTCfsyyi/LakeHub-production?node-id=299-174)

These references supersede the original Home reference in `block-migration.md`. Inspect current evidence for both exact nodes before implementation; the Programs node identifier is unchanged but its contents may have changed. Use MCP design context when available, or the approved export workflow below when access is limited.

## Export handoff when MCP is unavailable

In Figma Design Mode, select each approved frame and add export settings in the right sidebar:

1. Export a PNG at **2x** for visual comparison, using sRGB for consistent browser comparison.
2. Export an SVG at **1x**. In SVG export settings, disable **Outline text** and enable **Include id attribute**. Keep the PNG alongside it because SVG export may differ for effects such as background blur.
3. Export new photographs and icons separately when their exact source cannot be recovered from the frame SVG. For photo-filled impact numbers, include the underlying photographs, not only an image of the finished number: the numeric value must remain editable.
4. Include approved mobile frames if they exist. If none exist, note that in the handoff; responsive layouts will stack the same content while preserving hierarchy.

Place files in the ignored `.runtime/design-refresh/` directory using `home.png`, `home.svg`, `programs.png`, and `programs.svg`; place separate assets in its `assets/` subdirectory. Existing differently named exports or chat attachments can also be used. Add an `export-notes.md` with export date, source frame links, intended frame widths, and whether mobile references exist. Do not include tokens or credentials.

Compare the current exports with cached design context, extract exact assets, and inventory section structure, text, typography, colours, spacing, and destinations. Current exports take precedence over old cache files. SVGs provide rendered geometry but may omit auto-layout, responsive constraints, or component intent; resolve material gaps using measurements or copied CSS from Figma Design Mode rather than inventing design details.

Promote shipped assets to project-owned theme assets or the Media Library and record the source mapping in this document. Never use the whole-page screenshot or SVG as the webpage: the implementation remains editable WordPress blocks. Keep changing frame references and export status outside `AGENTS.md`.

References: [Figma export settings](https://help.figma.com/hc/en-us/articles/13402894554519-Export-formats-and-settings-for-static-designs), [Design Mode inspection](https://help.figma.com/hc/en-us/articles/22012921621015-Guide-to-inspecting), and [MCP rate limits](https://developers.figma.com/docs/figma-mcp-server/plans-access-and-permissions/).

## Implementation requirements

- Keep reusable tokens in `theme.json`, shared structure in template parts, and editable page sections in filesystem patterns inserted as native blocks. Keep named sections and structural/content-only locks, with direct controls for text, images, and destinations.
- The inspected Home reference uses a photo-backed hero, four alternating photo-filled impact numbers, a journey timeline, partners, post-driven insights, a call to action, and shared navigation/footer. Numbers must remain editable text, with an accessible solid-colour fallback. Exact image assets must remain local.
- Retain the Programs content type and `lakehub/programs` block. Determine page-specific changes from fresh design context rather than assuming the existing frame contents are unchanged.
- Retain independently editable milestones and logos, and post-driven Insights. Partners automatically scroll with drag and keyboard navigation and a pause/play control; Insights retain user-triggered scrolling. Use short hover/focus transitions, respect reduced motion, and keep content accessible without JavaScript.
- Keep newsletter signup a non-submitting visual preview. No subscription service integration is included.
- Implement an explicit, versioned refresh migration with dry-run output and a fresh rollback snapshot. Do not simply increase the old migration version and rerun its original overwrite logic. Pattern edits alone do not update saved pages. Inspect Site Editor overrides before changing shared parts.

## Local workflow and acceptance

Use Studio with this existing repository and MySQL. Verify database connectivity, Studio initialization, site registration, and PHP compatibility before changing local URL configuration. Preserve the existing environment loader and Git/R2 backup scripts. Back up the database before content migration; dry-run any required URL replacement.

Verify both pages against the exact Figma references at desktop size, then check 320, 390, 768, 1024, and 1440px for overflow, cropping, readable text, and usable navigation. Verify editor/frontend parity, save/reload without block recovery, text/image/link editing, collection ordering, keyboard operation, and reduced motion. Run project PHP syntax checks and the existing block editor tests against the confirmed local site. Test refresh idempotence and rollback on a disposable database copy.

Update `editing-guide.md` with the final controls and local workflow after verification. Keep runtime diagnostics, changing URLs, screenshots, and implementation status outside `AGENTS.md`. Use `scripts/push.sh` for authorized commits, Git pushes, and R2 backups; publishing a live site or remote preview is a separate operation.

## Inspection status

### Studio registration, 9 September 2026

The existing repository is registered as **LakeHub Social**, with native PHP 8.5, port 8881, and WordPress auto-updates disabled. Registration preserved `wp-config.php` and did not create SQLite artifacts. A local database backup is stored at `.backups/before-studio-20260909.sql`. Direct WP-CLI confirmed the local environment, active LakeHub theme, and existing MySQL connection. No database URLs were changed.

**Startup is pending a compatibility fix.** Inspection of the installed Studio CLI 1.21.0 found that native startup calls `ensureWpConfig`, which passes `DB_NAME = wordpress` to its configuration transformer. An in-memory check confirmed that this replaces the project's `lakehub_required_env('DB_NAME')` expression. Do not start this registered site until a supported configuration-preserving startup path is verified. The stored site URL remains `http://lakehub-social.com`; registration's assigned port is not a verified running preview URL.

Studio also generated `CLAUDE.md` and `STUDIO.md`. Those newly generated files were moved to ignored `.runtime/studio-generated/` so their generic runtime instructions do not override the project's workflow. Existing instructions and the staged MCP configuration were preserved.

### Design exports

Home design context was retrieved on 8 September 2026. Further Figma calls, including the corrected Programs target, returned the connector's Starter-plan quota error. The user subsequently approved current local exports as the alternative to waiting for quota restoration. The local Programs context and screenshots date from 7 September and cannot establish whether that frame has since changed. Current Home and Our Programs PNG/SVG exports were supplied on 9 September 2026. Both SVG canvases are 1610px wide but the intended page artwork is 1280px wide; the extra transparent canvas is excluded from browser comparisons. No mobile frames were supplied, so the implementation stacks the same content responsively. The updated pages are applied locally with native editable blocks.


## Applied refresh

LakeHub Social 3.1.0 and LakeHub Site 1.1.0 implement the exported designs. Home uses a photo Cover hero, native Group backgrounds clipped to editable figures, the updated journey descriptions, and the smaller solid-button CTA. Programs uses a centred Cover hero with the supplied cropped 01 artwork, an editable collection heading, and the existing dynamic program collection with semantic third-level card headings. Program descriptions use Inter as in the export. Old block styles remain registered for previously saved pattern copies.

The supplied impact copy contains obvious rendering/typing errors (an invisible end of “engineers” and “graduation.s.”); the implementation uses complete, readable words. Page images and the figures' background photographs have Media Library copies. The original font files, program photos, and Insights photos are reused; the three Insights photo files were confirmed byte-identical to the embedded exports. Mobile navigation and user-triggered Insights scrolling retain their keyboard and reduced-motion support. Newsletter submission and the unset Zone01 destination remain outside this update.

### Commands

Run from the repository root after confirming the local target and exporting a fresh database backup:

```bash
wp --path="$PWD" lakehub design refresh --dry-run
wp --path="$PWD" lakehub design refresh
```

The refresh snapshots affected fields under `lakehub_design_refresh_snapshot_v1`; `lakehub_design_refresh_version` makes successful runs idempotent. It preserves page IDs, slugs, program destinations/thumbnails, article bodies, unrelated content, and the original block migration snapshot. The pre-refresh database dump is `.backups/before-design-refresh-20260909.sql` (local and ignored).

For recovery, after backing up any subsequent editing, `wp --path="$PWD" lakehub design rollback` restores refresh-owned fields. Restore matching source to recover the previous appearance. Rollback retains imported media and the snapshot for reapplication. Do not rerun the original block migration to apply this refresh.

### Export provenance

The following files were extracted from embedded image data without resampling; `zone01-mark.svg` preserves the original rectangle, crop transform, pattern, and referenced image from Programs. Source PNG/SVG exports remain in the ignored handoff directory.

| Shipped asset | Export image ID |
| --- | --- |
| `assets/images/refresh/home-hero.jpg` | Home `image1_615_348` |
| `assets/images/refresh/engineers.jpg` | Home `image2_615_348` |
| `assets/images/refresh/partners.jpg` | Home `image3_615_348` |
| `assets/images/refresh/placement.jpg` | Home `image4_615_348` |
| `assets/images/refresh/startups.jpg` | Home `image5_615_348` |
| `assets/images/refresh/programs-hero.jpg` | Programs `image6_299_174` |
| `assets/images/refresh/zone01-mark.svg` | Programs `pattern7_299_174` / `image7_299_174` |

- Home.svg SHA-256: `2d0a90e82149a83bc82d256b75676aec11456b54296379dbed0ee7414ed30885`
- Our Programs.svg SHA-256: `b576bf6c42dda2c643d79603ea08c0d2d6a12d41a90991324768365e9bbf2a80`

### Verification on 9 September 2026

- Both updated pages and all registered LakeHub patterns parsed and saved/reloaded without invalid blocks. Temporary drafts verified headings, images, button links, section movement/insertion/removal, and program description/image/link/order controls.
- The expanded editor test verified that a figure value and native Group background image can change and survive reload while its internal blocks remain locked. WordPress mounts offscreen Groups lazily, so tests select the figure before checking live lock settings.
- Both pages passed at 320, 390, 768, 1024, 1280, and 1440px with no document overflow or missing images and one primary heading. Desktop and mobile screenshots were visually checked against the supplied exports. Figures remained readable in forced-colour mode; mobile navigation and reduced motion passed.
- Rollback, reapplication, repeat-run idempotence, attachment reuse, original/refresh snapshot preservation, program links/thumbnails, and article-body preservation passed on an isolated table-prefix copy. The database user cannot create separate databases, so verification used disposable tables in the same database, then removed those tables.
- Project PHP and JavaScript syntax, Theme JSON schema, and Git whitespace checks passed. The database health check passed; LakeHub Social 3.1.0 and LakeHub Site 1.1.0 are active.

The current local preview is served by the existing ignored router at `http://127.0.0.1:8080/` and `/programs/`. The router maps stored canonical URLs only in preview responses; the database URLs and `wp-config.php` remain unchanged. Studio native startup remains subject to the compatibility issue documented above.

### Interaction refresh

- Partners scroll continuously at approximately 25px/second, with mouse/touch dragging, Left/Right keyboard navigation, and a pause/play control. Hover, focus, offscreen positioning, and a hidden tab suspend autoplay; reduced motion disables it. Short collections remain static until they overflow the responsive layout. Repeated visual items are excluded from the tab order and accessibility tree.
- Logos restore their supplied colours and enlarge on hover/focus. Journey text and markers enlarge independently without moving neighbouring milestones. Actionable buttons lift with a shadow; white outlines fill white with teal text. Header links lift and use the bundled medium font weight.
- Program cards use a cursor-following highlight without rotating their content. Gradients stretch to the full card height and align to the bottom without repeating, including cards whose text makes them taller than the original artwork.
- Enhancements are frontend-only CSS/JavaScript; saved block markup and client content remain unchanged. The editor retains a static partner layout. No interaction migration is required.

The public-page regression suite requires Playwright and an available Chromium browser. It does not change WordPress records:

```bash
LAKEHUB_TEST_URL=http://127.0.0.1:8080 node scripts/tests/interactions.cjs
```

Set `CHROMIUM_PATH` if using a separately installed Chromium. The suite covers autoplay, drag/click separation, touch and vertical scrolling, both loop boundaries, keyboard navigation, explicit pause/play, reduced motion, responsive gradients, shorter logo collections, and the JavaScript-disabled fallback. Editor save/reload remains covered by `scripts/tests/block-editor.cjs` using an authenticated local browser state.

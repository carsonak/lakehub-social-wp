# Figma parity review and hero alignment

## Scope and status

| Phase | Scope | Status |
| --- | --- | --- |
| 01 | Retrieve and validate durable design evidence | Complete; cached and indexed |
| 02 | Correct four photo heroes against exact Figma references | Complete; d459a08 and full export backed up |
| 03 | Approved typography corrections across existing pages | Complete; be742af and full export backed up |
| 04 | Final regression verification, backup and preview refresh | Complete; existing preview refreshed and all 14 hosted checks passed |

- [x] Cache both canvas inventories and all five page references.
- [x] Save full-resolution renders, available contexts, source assets, style index and checksums.
- [x] Measure current heroes and identify concrete alignment/type differences.
- [x] Record quota gaps and user decision to restore each frame's original size.
- [x] Review and approve phase 02 implementation plan.
- [x] Implement and verify phase 02; commit and back up through usual scripts.
- [x] Record a separate section-by-section static parity checklist for phase 03 before changes.

Evidence: [cache index](../../design-cache/2026-10-29/README.md). No theme code, block content, runtime configuration or database records changed during phase 01. The user explicitly excludes interactivity/animation from design parity work; preserve all existing behavior.

## Phase 02 implementation plan

Keep the current modular native block theme, editable heading/button blocks and canonical filesystem patterns. Reuse the existing local fonts and images after checking their exact asset mapping. Keep CSS in `assets/css/heroes.css`, shared tokens in `theme.json`, and editor/frontend loading in `inc/enqueue.php`. Remove the uniform typography override only where it conflicts with exact page references. The user's choice is to restore each Figma frame's original sizes; design weights/line heights and alignment are recorded explicitly below for review.

| Page | Exact reference | Target at 1280px | Concrete change |
| --- | --- | --- | --- |
| Home | 615:348; hero 615:362, text 615:366 | 76/70px, weight 800, centred 724px text box; hero 538px | Restore compact line rhythm, heading measure/placement and button placement from cached hierarchy; preserve accent, photo slideshow and button behavior |
| Programs | 299:174; hero 593:626 | 56/70px, weight 800; hero 572px | Restore heading size and placement with a separate brand lockup; align title, brand and View Program control to frame |
| About | 380:71; hero 655:534, text 655:535 | 56/56px, weight 700, x=108, width=1064, left aligned, vertically centred; hero 429px | Replace current 940px centred heading measure with design gutters/measure and vertical placement; retain editable text |
| Impact | 409:150; hero 587:564, text 587:575 | 56/52px, weight 700, centred 672px text box; hero 480px | Restore original wrapping and vertical placement so heading no longer expands the cover; preserve background crop/overlay |

Use flow/flex/grid and responsive gutters rather than copying absolute-positioned React. Match desktop text geometry/line breaks using actual local font metrics. At narrow widths allow natural wrapping and growing minimum heights; no clipping or text/button collisions. No mobile frame was returned, so document responsive adaptation as an implementation choice rather than a verified Figma specification.

Component/file diffs: `heroes.css` gets shared and per-page geometry/type rules; `sections.css` only loses rules that conflict with those rules; `theme.json` reuses existing size presets or adds a clear hero preset only when required; replace the six uniform-type assertions in `scripts/tests/browser/hero-typography.spec.cjs` with page-specific reference expectations. No JavaScript changes are planned. Avoid saved block markup changes. If markup/content changes prove necessary, inspect overrides, take a fresh full export, validate blocks and perform an explicit reversible migration; do not silently rewrite published content.

## Verification matrix

1. Capture all four banners at 1280px and compare text/controls/image crop against the cached exact frames. Check font family/size/weight/line-height, text alignment, line breaks, heading measure, horizontal/vertical offsets, hero heights and button bounds. Use rendered glyph positions as well as element boxes.
2. Check 320, 390, 768, 1024 and 1440px for readable wrapping, no overflow, no overlap, preserved cover crops and keyboard access. Distinguish responsive adaptation from exact desktop matching.
3. Confirm editor/frontend stylesheet parity; insert/save/reload only on a disposable draft if markup changes, without recovery warnings. Preserve published content IDs and user edits.
4. Run theme static checks, project PHP lint and relevant browser checks; run all existing interaction regressions to protect behavior. Run backup script syntax/ShellCheck and backup unit checks when the backup workflow changes.
5. Review worktree/index, make one conventional implementation commit, make a full Studio export and run the usual push/backup workflow. Update this phase checklist immediately. Refresh the already-approved existing preview if requested for the implementation, then verify hosted rendering after propagation.

## Future static-parity backlog (outside this typography pass)

Review Home, Programs, About, Impact and the blog in ordered page-sized phases, with shared header/footer changes isolated when appropriate. Compare static layout, typography, colours, spacing, imagery/crop and component geometry; log each difference with node, screenshot/evidence, current selector and proposed fix. Reconcile separate transformation proposal versus current Impact before changing that section. Use page-local evidence to avoid extra MCP calls. Keep canonical patterns/templates/tokens in Git and preserve editable native blocks and dynamic collections. Do not overwrite content or replace carousel/animation behavior with static Figma arrangements.

The user approved phase 02, then authorized the typography follow-up and backup/preview refresh. Future changes outside this approved scope need their own reviewable plan.

## Approved follow-up — typography, 29 October

The user approved the hero plan, chose original per-frame sizes, then authorized sizing/weight/font-family corrections and requested backup plus preview refresh. Preserve the updated centered Malika portrait and real article content. Existing hover, animation, carousel, keyboard and reduced-motion behavior remains required. Decorative dots, other image/crop changes, team grid gaps and Insights spacing are outside this typography follow-up.

### Phase 03 component diffs and verification

- [x] Home: metric preset 127.5 → 170px at 1280px; number line-height matches 100.005%; Impact Through Precision 30 → 32px. Preserve responsive fit and hover scaling.
- [x] Programs: use Hanken Grotesk for cards, titles (36px/600) and descriptions (16/25px); section heading Inter 32/40px at weight 600. Preserve editable collection and current content.
- [x] About: section headings 36/40px Inter 600, introduction 36/56px Inter 700; Mission questions 32/50px Inter 600; team names 20/28px Inter 600 and body 14/20px. Keep responsive adaptation and pointer sheen.
- [x] Impact: community heading Inter 32/40px 700; transformation heading Hanken Grotesk 36/52px 700; circle titles 24/24px and body 16/20px. Keep existing layout and animation.
- [x] Blog: bundle licensed local Roboto normal weights 100–900 from official Google Fonts source; register in theme.json for frontend/editor. Title 48px/1.2, section headings 40px/1.2, body 16/24px, quote 20/28px; use Roboto where the frame specifies it, retain Hanken Grotesk for introductory text and Inter for quotes. Correct reading measure to 768px of usable text with responsive outer gutters; keep current copy/photos/share controls. Loading Roboto also resolves the existing Coming Soon font reference; verify that page.
- [x] Use existing modules and presets, adding named reusable tokens only where needed. No block serialization or database migration is planned. No extra Figma reads.
- [x] Verify exact desktop typography and font loading, screenshots at 1280px, responsive fit at 320/390/768/1024/1440px, editor styles, and complete interaction regressions. Preserve content/media baseline. Commit and full-export backup this phase separately.

Phase 04: verify final export/source manifest and restore checks, push documentation checkpoint, update the existing approved preview hostname and run hosted typography checks after propagation. Keep runtime artifacts ignored. Pre-change full export: `.backups/figma-parity-before.zip`.

## Completion

Approved hero and typography changes are complete, with current editorial content, Malika portrait and interactions preserved. All 47 distinct local browser cases and 14 hosted cases passed; editor validation/styles, published-content/media preservation and full-export restore verification passed. The updated preview is https://carsoniskihara-grykm-studio.wp.build. Source checkpoints: d459a08 and be742af; final task documentation is checkpointed separately through the usual script.

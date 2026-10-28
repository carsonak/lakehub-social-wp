# Figma parity review and hero alignment

## Scope and status

| Phase | Scope | Status |
| --- | --- | --- |
| 01 | Retrieve and validate durable design evidence | Complete; cached and indexed |
| 02 | Correct four photo heroes against exact Figma references | Plan ready for review; no site changes |
| 03 | Audit remaining static differences page by page | Planned; use local evidence before more MCP calls |

- [x] Cache both canvas inventories and all five page references.
- [x] Save full-resolution renders, available contexts, source assets, style index and checksums.
- [x] Measure current heroes and identify concrete alignment/type differences.
- [x] Record quota gaps and user decision to restore each frame's original size.
- [ ] Review and approve phase 02 implementation plan.
- [ ] Implement and verify phase 02; commit and back up through usual scripts.
- [ ] Record a separate section-by-section static parity checklist for phase 03 before changes.

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

## Phase 03 strategy

Review Home, Programs, About, Impact and the blog in ordered page-sized phases, with shared header/footer changes isolated when appropriate. Compare static layout, typography, colours, spacing, imagery/crop and component geometry; log each difference with node, screenshot/evidence, current selector and proposed fix. Reconcile separate transformation proposal versus current Impact before changing that section. Use page-local evidence to avoid extra MCP calls. Keep canonical patterns/templates/tokens in Git and preserve editable native blocks and dynamic collections. Do not overwrite content or replace carousel/animation behavior with static Figma arrangements.

Approval is required before phase 02/03 code or database modifications under the repository's task-planning instruction. The inspection/cache itself is already requested and does not modify the site.

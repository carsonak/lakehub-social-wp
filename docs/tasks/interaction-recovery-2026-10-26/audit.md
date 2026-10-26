# Refactor audit

CSS parser comparison: 714 historical rules; 2,033 effective selector/property/at-rule-context entries. Current: 1,826 entries. Found 294 missing and 47 changed candidates. The JSON ledger preserves every candidate and resolution. Compare actual cascade too: duplicate rules, shorthand equivalence, and the separately loaded halftone-density sheet can supersede text differences.

PHP: all pre-split hook names, native navigation helper, supports, block style names, editor permissions, hero slides, and halftone registrations remain present. Coming Soon frontend enqueue is missing. Current separate core asset loading is retained.

JavaScript: partner carousel, program card tilt/glare and reveal, timeline keys, Insights navigation/arrow bounce, metric observers, halftone pointer response, transformation grid, slideshow, social sharing, story drawer, newsletter and sticky navigation all remain in the corresponding modules. External-link handling regressed: the click-time handler was dropped and existing rel tokens are overwritten. Restore those while preserving the newer exclusion of mailto/tel/fragment links.

Reconstructed rather than recovered: moving header indicator and team-card pointer sheen. Requested addition: Journey mouse drag. No saved markup/content migration required.

Design provenance: existing approved exports in docs/design-exports/16-09-2026 and docs/design-refresh.md; this task restores historical behavior without claiming updated Figma frames were inspected or unchanged.

Backup before modification: .backups/interaction-recovery-before.zip, full Studio export succeeded. Studio target and active theme verified through Studio tools. Browser DOM baseline requests are pending; direct network access requires sandbox escalation.

## JavaScript body comparison

Transformation and collapsible modules retain their feature bodies verbatim apart from wrappers/comments. Partner carousel drops only an unused `section` variable. Program cards/halftone/slideshow/social-share wrap the same behavior in standalone guards. Metrics retains measurement, line geometry, font readiness, scroll/resize/focus and motion-change listeners. External-link click-time protection and rel-token preservation were the confirmed behavioral omissions and are restored. Insights browsing deliberately changes from padded center selection to complete 3/2/1-card viewports per the approved plan.

## Completed CSS coverage

A second parser comparison leaves only three absent historical selector/property/context entries: the program background shorthand superseded by per-card local gradients and two static halftone backgrounds superseded by halftone-density and the dynamic generator. All are intentional and documented in the ledger. The original 341 candidates are accounted for: 310 recovered entries and 31 equivalent/superseded entries. Remaining value differences consist of corrected relative asset paths, effective spacing shorthands, the retained separate halftone layer, and the requested complete 3/2/1-card Insights viewport.

Pre-existing Coming Soon has a template page title plus its content heading. It predates this recovery and is not a lost interaction; tests assert the requested content layout/spacing without rewriting saved markup.

Studio inspection tools timed out; direct Chromium verification succeeded with localhost IPv4 resolution and bypassed proxy. No server replacement or database reset was used.

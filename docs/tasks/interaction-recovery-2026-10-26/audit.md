# Refactor audit

CSS parser comparison: 714 historical rules; 2,033 effective selector/property/at-rule-context entries. Current: 1,826 entries. Found 294 missing and 47 changed candidates. The JSON ledger preserves every candidate and resolution. Compare actual cascade too: duplicate rules, shorthand equivalence, and the separately loaded halftone-density sheet can supersede text differences.

PHP: all pre-split hook names, native navigation helper, supports, block style names, editor permissions, hero slides, and halftone registrations remain present. Coming Soon frontend enqueue is missing. Current separate core asset loading is retained.

JavaScript: partner carousel, program card tilt/glare and reveal, timeline keys, Insights navigation/arrow bounce, metric observers, halftone pointer response, transformation grid, slideshow, social sharing, story drawer, newsletter and sticky navigation all remain in the corresponding modules. External-link handling regressed: the click-time handler was dropped and existing rel tokens are overwritten. Restore those while preserving the newer exclusion of mailto/tel/fragment links.

Reconstructed rather than recovered: moving header indicator and team-card pointer sheen. Requested addition: Journey mouse drag. No saved markup/content migration required.

Design provenance: existing approved exports in docs/design-exports/16-09-2026 and docs/design-refresh.md; this task restores historical behavior without claiming updated Figma frames were inspected or unchanged.

Backup before modification: .backups/interaction-recovery-before.zip, full Studio export succeeded. Studio target and active theme verified through Studio tools. Browser DOM baseline requests are pending; direct network access requires sandbox escalation.

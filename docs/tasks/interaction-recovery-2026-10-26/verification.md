# Verification evidence

## Automated

- Full Playwright suite: **33/33 passed**, no retries, skipped, flaky or failed tests; 92.4 seconds. Seven pages at 1280, 768 and 390px plus actual interaction scenarios.
- Backup failure/evolution tests: **7/7 passed**. Covers future revisions/runtime metadata, stale exports, dirty source, wrong ZIP/manifest pairs, media/content drift, URL relocation, source drift and unsafe archive paths.
- Editor roundtrip: **81 valid nested blocks** saved/reloaded in a disposable draft; modular editor styles present. Scratch draft 261 and revisions deleted afterward.
- All project PHP syntax, theme JS syntax, modular CSS parsing, local CSS URL existence, frontend/editor enqueue coverage, Bash syntax and ShellCheck passed.
- Studio runtime verified: canonical path, active theme and all five active plugins. No vendor update/reset/import performed.
- Real full export and source manifest verified against Git and current SQLite/media markers. SQLite quick_check uses the SQLite engine, never MySQL tooling.

## Root cause and resolution

The September 18 CSS extraction omitted final override rules and responsive/accessibility treatments. Latest Git and the latest local full export both contained that incomplete refactor. Thus reinstalling/importing exposed a backed-up regression rather than proving the clone was wrong. The JS split also dropped click-time external-link protection and rel-token preservation. Existing regression checks exercised initialization more than visible behavior.

All 341 CSS audit candidates are accounted for. Only three historical entries remain absent intentionally: a gradient shorthand superseded by local per-card images and two static halftone backgrounds superseded by the separate density layer/generator. Current relative asset paths, effective spacing shorthands and dynamic halftone treatments are retained. The user-requested 3/2/1 complete-card viewport supersedes historical padded-center sizing.

Header pointer underline and team sheen were not located in inspected snapshots and were reconstructed from the user's description. Journey dragging was explicitly added. Historical Git refs here explain this audit only; backup/restore tools derive future expectations dynamically from each manifest.

## Artifacts and limits

Local ignored reports/screenshots: `.runtime/interaction-recovery/`. Full exports and push logs: `.backups/interaction-recovery-*`. Approved static design evidence: existing exports under `docs/design-exports/16-09-2026/`; no claim is made that current Figma frames were revalidated or unchanged. This work restores established layout and behavior, not a new Figma implementation.

Studio DOM-inspection tools timed out; direct Playwright browser verification succeeded. Initial browser navigation timeouts were resolved for verification by explicit localhost IPv4 resolution and proxy bypass. One pre-existing duplicate heading on Coming Soon was kept outside this interaction recovery; its content/button spacing passes all viewports. Original media and published content remain intact.

## Hosted preview

https://carsoniskihara-grykm-studio.wp.build — created and listed active by Studio. Three hosted Chromium checks pass: complete Home geometry/images/assets, header indicator movement/reset, Mission/Vision zoom and story expansion/collapse. Exact expiration was not returned by Studio. Final full export is `.backups/interaction-recovery-final.zip`, paired with the final source revision by the usual push script.

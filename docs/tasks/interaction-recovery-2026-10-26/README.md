# Interaction recovery — 2026-10-26

Approved in conversation: preserve modularisation, audit all refactor losses, restore interactions, make conventional phase commits, back up through the usual scripts, and create a new preview.

## Architecture and implementation

Compare pre-refactor PHP (`fba0d7a^`), CSS (`719c37c^`), and JS (`d3cce99^`) with the modular implementation. Recover missing declarations in their owning modules, preserve later fixes and local assets, and change no saved block serialization or content. Reconstruct header indicator/team sheen separately. Add timeline dragging. Keep backup expectations dynamic, paired with each export's revision rather than a fixed project version.

| Phase | Deliverable | Status |
| --- | --- | --- |
| 01 | Preserve baseline and complete parity ledger | Complete |
| 02 | Restore refactor omissions | Complete |
| 03 | Reconstruct pointer interactions | Pending |
| 04 | Behavioral tests and future-proof backup validation | Pending |
| 05 | Final verification, backup/push, preview | Pending |

## Verification matrix

Home, About, Team, Programs, Impact, Coming Soon and an article: desktop/tablet/mobile; mouse, keyboard, touch, reduced motion; hover colors/transforms, carousel geometry and movement, drag/reset, crop, footer, mission collage, metrics, programs, story, halftones, slideshow, transformation, share links. Check editor reload, console/HTTP errors, project PHP syntax, JS syntax, Bash syntax and ShellCheck. Record limitations honestly.

## Baseline

Source HEAD: `d6da162`; canonical Studio site at `http://localhost:8881/`, PHP 8.4, WordPress 7.1.3, active theme 3.2.3. These are observations, not restore requirements. Pre-repair full export: `.backups/interaction-recovery-before.zip`. Unrelated core and third-party plugin modifications are preserved and excluded from task commits.

The latest local September export matches the modularised theme. Missing styles already exist in that export, so another import would repeat the regressions. Existing tests checked initialization more than behavior. The original reinstall/restore sequence cannot be established conclusively.

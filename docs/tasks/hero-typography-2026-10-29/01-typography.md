# Shared typography

- [x] Complete phase scope.
- [x] Record verification.
- [x] Commit and back up through usual workflow.

Home, Programs, About and Impact now share `heroes.css`, loaded in frontend and editor, the existing `hero-photo` size preset, and theme.json weight 800 / line-height 1.1 tokens. Removed conflicting per-page heading typography. About inline text inherits. No content, serialization, database or vendor changes.

Six browser tests passed at 1440, 1280, 1024, 768, 390 and 320px: equal heading size/weight, inline inheritance, line-height, containment and button separation. Desktop/mobile captures are in ignored `.runtime/hero-typography/`; visually inspected Home desktop, Impact desktop and About mobile. Static CSS/enqueue checks pass. The larger Impact heading wraps onto more lines and its minimum-height cover grows naturally.

A fresh full pre-change Studio export is `.backups/hero-typography-prechange.zip`. The earlier interrupted export was incomplete and is not used for backup.

Checkpoint uses `scripts/push.sh` with the full post-change export; upload success is recorded in phase 02 after the script returns.

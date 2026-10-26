# 02 Restoration

Restore omitted styles, responsive/editor states, crop rules and asset enqueues in owning modules; restore carousels; add Journey mouse dragging; verify affected behaviors.

- [x] Implement phase scope.
- [x] Run phase verification and record evidence.
- [x] Review diffs, commit intended changes, and back up checkpoint.

Verification: all modular CSS parses with PostCSS; PHP enqueue syntax and changed JS syntax pass. Chromium smoke passed: actual Insights next scroll, white outline fill, Mission counter-rotated zoom, and 40px Coming Soon separation. Desktop Home/About/Team have no document overflow. Alpha crop visually restored. Full responsive/keyboard suite follows in Phase 04. Backup checkpoint: `.backups/interaction-recovery-restored.zip`.

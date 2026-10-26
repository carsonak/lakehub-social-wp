# Phase 04 — Verification and backup reliability

- [x] Declare reproducible Playwright/PostCSS tooling, lockfile, static checks and configurable local URL.
- [x] Exercise responsive geometry, scrolling, hover/reset, focus, reduced motion and mobile navigation with behavioral assertions.
- [x] Save/reload disposable editor draft: 81 nested valid blocks; modular iframe styles present; draft deleted afterward.
- [x] Add dynamic source/export manifests, read-only restore verifier, future-version and failure tests, and recovery documentation.
- [x] Run PHP/JS/CSS, Bash and ShellCheck validation; seven backup unit tests pass.
- [x] Record final full browser result, commit and back up phase.

The manifest is derived per export: committed project-owned files from configured source roots, archive/SQL hashes, observed Studio metadata and published-content/media markers. Future commits and versions get their own baseline. The real pointer-phase export passed source and restored-site verification.

Final browser suite: **33 passed**, zero skipped/flaky/failed, 92.4s. JSON evidence: `.runtime/interaction-recovery/results.json`. Conventional tooling checkpoint: `b1e6526`. Full phase export: `.backups/interaction-recovery-verified.zip`; backed up via the usual script after this checkpoint.

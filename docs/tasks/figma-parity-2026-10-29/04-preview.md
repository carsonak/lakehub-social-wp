# Final backup and hosted preview

- [x] Complete local regression, editor and content/media verification.
- [x] Back up implementation phases through usual scripts and verify final restore archive.
- [x] Refresh full-site preview and verify hosted typography.
- [x] Push final task documentation checkpoint and refresh backup manifest.

Implementation checkpoints: d459a08 (hero parity), be742af (remaining approved typography). Final full Studio export: `.backups/figma-typography-final.zip`. Its read-only restore check passed, including source/checkout agreement, published content and media, and SQLite health. Local verification: 47 distinct browser cases passed, seven backup unit tests, static theme checks, PHP lint, Bash/ShellCheck, and read-only editor validity/font loading. The two initial runtime failures passed on isolated recheck; see phase 03 for the actual run breakdown.

Preview target explicitly authorized by the user: https://carsoniskihara-grykm-studio.wp.build. Run both hero and typography suites against this hosted URL after Studio finishes and cache propagation completes. Preserve content and the updated Malika photo; do not copy Figma placeholders back into the site.

Studio preview_update completed successfully at the existing URL. A plain-URL browser probe confirmed the corrected Home hero before testing. All 14 hosted hero/typography cases passed in one run, including desktop reference geometry, six hero widths, three cross-page responsive widths, local Roboto loading, content values and the retained Malika portrait. Log: `.runtime/figma-parity-audit/hosted-tests.log`.

The final documentation checkpoint uses the same verified full export through `scripts/push.sh`; the script skips an identical archive upload, refreshes the latest manifest and pushes the new Git revision. No site source changed after the verified export.

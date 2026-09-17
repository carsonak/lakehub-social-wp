# Workspace Cleanup & Push/Pull Speed Optimization (2026-09-17 16:07)

## Overview & Execution Plan

This directory tracks the cleanup of local and remote storage, Astra Starter Templates removal, Git object packing, and push/pull script optimizations to make backup uploads, downloads, and workspace sync lightweight and fast.

## Master Task Status

| # | Task Document | Status | Scope / Deliverable |
|---|---|---|---|
| **01** | [`01-astra-starter-templates-removal.md`](01-astra-starter-templates-removal.md) | `Complete` | Deactivate & uninstall `astra-sites`, purge demo upload caches, remove orphan PNG, update `.gitignore` and `AGENTS.md` |
| **02** | [`02-local-and-git-workspace-pruning.md`](02-local-and-git-workspace-pruning.md) | `Complete` | Delete local backups older than Monday 2026-09-14, remove `.runtime/mysql/`, pack loose Git objects (`git gc`) |
| **03** | [`03-cloudflare-r2-remote-cleanup.md`](03-cloudflare-r2-remote-cleanup.md) | `Pending` | Prune legacy pre-Monday SQL dumps in `r2:database/` and legacy root `uploads/` directory on Cloudflare R2 |
| **04** | [`04-pre-upload-checksum-and-script-optimizations.md`](04-pre-upload-checksum-and-script-optimizations.md) | `Pending` | Pre-upload checksum check & Cloudflare R2 server-side copy in `scripts/lib/common.sh`, conditional pull caching |
| **05** | [`05-re-export-testing-and-push-benchmark.md`](05-re-export-testing-and-push-benchmark.md) | `Pending` | Full Studio re-export, Playwright test suite validation, `./scripts/push.sh` and `./scripts/pull.sh` speed benchmarks |

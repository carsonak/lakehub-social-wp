# Task 06: Final Studio Export & Cloudflare R2 Push

## Scope & Objective
Create a verified full Studio export, execute `./scripts/push.sh`, upload the new baseline to Cloudflare R2, enforce remote retention, and push all commits to GitHub.

## Checklist
- [ ] Prepare full WordPress Studio export ZIP archive.
- [ ] Validate archive integrity (`validate_studio_export`).
- [ ] Stage all tracked source modifications (`git add -A`).
- [ ] Run `./scripts/push.sh` to commit, upload to Cloudflare R2, prune remote exports, and push Git branch.
- [ ] Verify remote R2 bucket status and Git log.

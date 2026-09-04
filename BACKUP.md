# Backup and restore workflow

This repository stores the WordPress source in GitHub, including core, themes, plugins, project-owned Codex skills under `.codex/skills/`, and `AGENTS.md`. The untracked `wp-content/uploads/` directory and compressed MySQL dumps are stored in the Cloudflare R2 bucket `lakehub-social`.

Machine-local credentials and runtime files stay local. In particular, do not commit `.env`, `.runtime/`, `.backups/`, caches, logs, or WordPress upgrade working directories. The repository `.gitignore` also overrides common global ignores so required Codex skill files and distributable WordPress/plugin `build/` assets remain trackable.

## First-time setup

1. Clone the repository.
2. Copy `.env.example` to `.env`, fill every required value, and run `chmod 600 .env`.
3. Run `./scripts/setup.sh`.

The setup script uses installed PHP and MySQL tools when compatible. If PHP is missing, too old, or lacks `mysqli`, a checksum-verified portable PHP build is installed in `~/.local/bin`. Missing MySQL tools are installed under the current user through Pixi; WP-CLI and rclone are also installed in `~/.local/bin`. No `sudo` command is used. When no configured MySQL server is reachable and `DB_HOST` is `127.0.0.1:PORT`, an isolated instance is created under `.runtime/mysql/`.

The initial `.env` must be transferred separately through a password manager or another secure channel. It is deliberately never committed.

## Back up and push

Stage the source changes you want to commit, then run:

```bash
./scripts/push.sh "Describe the staged changes"
```

The script automatically stages `.codex/skills/` and `AGENTS.md`, then commits all staged files. It exports and uploads a dated MySQL dump plus `database/latest.sql.gz`, copies uploads to R2 without deletions, and finally pushes Git. Other unstaged tracked files are reported and left alone.

Before pushing, review both `git status --short` and `git diff --cached`. `git add .` respects the project ignore rules for R2-managed and runtime data, but it still stages every modification to files Git already tracks.

## Pull and restore

From a clean Git worktree, run:

```bash
./scripts/pull.sh
```

The script downloads and validates the latest dump, fast-forwards Git, retains a local pre-restore database dump, imports the R2 database, and copies uploads from R2. The five newest pre-restore dumps are kept under `.backups/pre-restore/`.

All database timestamps are UTC. R2 database history is retained indefinitely; configure an R2 lifecycle rule later if automatic expiry is desired.

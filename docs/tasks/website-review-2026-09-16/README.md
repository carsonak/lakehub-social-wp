# Website Review & Content Implementation — 16 September 2026

Master implementation plan for visual refinements, radial halftone vignette, home hero image slideshow, blog post template, "Coming Soon" link resolution, and complete content updates derived from the approved Figma exports and Google Drive source documents.

---

## Task Tracker

| Task | File | Status | Target Scope |
| :--- | :--- | :--- | :--- |
| **01** | [`01-git-track-design-exports-and-content.md`](01-git-track-design-exports-and-content.md) | `Complete` | Version 10 Figma export files (16-09-2026) and 4 Google Docs source files in Git |
| **02** | [`02-radial-halftone-vignette.md`](02-radial-halftone-vignette.md) | `Complete` | Radial halftone vignette behind photos: center-dense dot decay, 6-8px corner clearance, center anchoring, hover repulsion |
| **03** | [`03-home-hero-image-slideshow.md`](03-home-hero-image-slideshow.md) | `Complete` | 4-image slideshow (`home-hero.jpg` + 3 slides), 3s endless cycle, no hover pause/controls, reduced-motion randomizer |
| **04** | [`04-blog-post-template-and-articles.md`](04-blog-post-template-and-articles.md) | `Complete` | Single post template (`single.html`) matching `blog-template` design, publish Google Drive insight articles, Query Loop wiring |
| **05** | [`05-coming-soon-and-link-resolution.md`](05-coming-soon-and-link-resolution.md) | `In Progress` | Dedicated "Coming Soon" page, complete site-wide link resolution (ReadMore buttons, CTAs, footer links) |
| **06** | [`06-site-copy-updates.md`](06-site-copy-updates.md) | `Pending Approval` | Comprehensive copy updates across Home, About, Impact, and Programs pages, plus Rodgers Kaunda team update |
| **07** | [`07-verification-and-regression-tests.md`](07-verification-and-regression-tests.md) | `Pending Approval` | PHP linting, Playwright regression suite, visual verification baseline across viewports |

---

## Agent Handoff & Execution Protocol

Any AI agent picking up this work must adhere to the following sequence:

1. **Check Status**: Inspect this `README.md` and the individual task file's **Progress & Tracking** section.
2. **Atomic Execution**: Complete tasks in numerical order (01 through 07).
3. **Phase-by-Phase Backups & Progress Tracking**:
   - Immediately after completing each phase/task, update the checklist (`- [x]`) in that task's document.
   - Update the status column in this `README.md` (e.g. `Pending Approval` -> `In Progress` -> `Complete`).
   - Run verification checks for that task.
   - Review `git status --short` and record a clean git commit for that phase's changes so progress is preserved and checkpointed in Git.
4. **Recording Unplanned Changes**: If any task requires adapting to an edge case or deviating from the initial plan, document the deviation under **Unplanned Changes & Scope Deviations** in that task's file before committing.
5. **Verification Baseline**:
   - Project PHP syntax: `find wp-content/themes/lakehub-social wp-content/plugins/lakehub-site -type f -name '*.php' -print0 | xargs -0 -n1 php -l`
   - Playwright review regression suite:
     `CHROMIUM_PATH=/usr/bin/google-chrome NODE_PATH=/home/akihara/.studio/cli/node_modules REVIEW_TASK=all node scripts/tests/review.cjs`
6. **Git & State Safety**:
   - Never stage runtime/database artifacts (`.runtime/`, `.env`, `.backups/`, `.ht.sqlite`).
   - Review `git status --short` and `git diff` before committing.

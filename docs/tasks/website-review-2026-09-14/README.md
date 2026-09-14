# Website Review & Visual Tweaks — 14 September 2026

Implementation plan for visual refinements, halftone grid sizing and offsets, cross-grid collage alignment, copy updates, and program card scroll animations derived from approved Figma exports.

---

## Task Tracker

| Task | File | Status | Target Scope |
| :--- | :--- | :--- | :--- |
| **01** | [`01-git-track-design-exports.md`](01-git-track-design-exports.md) | `Complete` | Move 8 Figma export files (PNG @ 2x, SVG @ 1x) to `docs/design-exports/` for Git versioning |
| **02** | [`02-halftone-grid-sizing-and-offsets.md`](02-halftone-grid-sizing-and-offsets.md) | `Complete` | 28px dot pitch tile, exact image frame matching across all viewports, section-specific offsets |
| **03** | [`03-mission-vision-cross-grid.md`](03-mission-vision-cross-grid.md) | `Pending` | Mission & Vision collage alignment, equal parallel edge distance, left diamond diagonal on center |
| **04** | [`04-about-page-copy-updates.md`](04-about-page-copy-updates.md) | `Pending` | Add "About LakeHub" narrative block, update Mission & Vision questions and paragraphs |
| **05** | [`05-program-card-directional-scroll.md`](05-program-card-directional-scroll.md) | `Pending` | Directional fade/slide for program cards (bottom-right on scroll-down, top-right on scroll-up) |

---

## Agent Handoff & Execution Protocol

Any AI agent picking up this work must adhere to the following sequence:

1. **Check Status**: Inspect this `README.md` and the individual task file's **Progress & Tracking** section.
2. **Atomic Execution**: Complete tasks in numerical order (01 through 05). Do not combine multiple tasks into a single commit unless explicitly instructed.
3. **Recording Unplanned Changes**: If any task requires adapting to an edge case or deviating from the initial plan, document the deviation under **Unplanned Changes & Scope Deviations** in that task's file before committing.
4. **Verification Baseline**:
   - Project PHP syntax: `find wp-content/themes/lakehub-social wp-content/plugins/lakehub-site -type f -name '*.php' -print0 | xargs -0 -n1 php -l`
   - Playwright review regression suite:
     `CHROMIUM_PATH=/usr/bin/google-chrome NODE_PATH=/home/akihara/.studio/cli/node_modules REVIEW_TASK=all node scripts/tests/review.cjs`
5. **Git & State Safety**:
   - Never stage runtime/database artifacts (`.runtime/`, `.env`, `.backups/`, `.ht.sqlite`).
   - Review `git status --short` and `git diff` before committing.

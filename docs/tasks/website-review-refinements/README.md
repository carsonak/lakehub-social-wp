# Website Review Refinements — 14 September 2026

Master task index and implementation tracker for the refinements plan approved in `refined_halftone_scroll_and_scaling_plan.md`.

---

## Task Tracker

| Task | File | Status | Target Scope |
| :--- | :--- | :--- | :--- |
| **01** | [`01-dynamic-text-resizing-restoration.md`](01-dynamic-text-resizing-restoration.md) | `Complete` | Dynamic text resizing (`1.25vw`) restoration for Figma 1280px proportions across wide desktop viewports |
| **02** | [`02-metric-mask-hover-text-zoom.md`](02-metric-mask-hover-text-zoom.md) | `Pending` | Metric numbers hover: text cutout stencil expands (`font-size`), underlying background image stays stationary |
| **03** | [`03-bidirectional-scroll-one-third-threshold.md`](03-bidirectional-scroll-one-third-threshold.md) | `Pending` | 1/3 (33.3%) viewport threshold triggers, bidirectional entry and exit animations accounting for header clearance |
| **04** | [`04-halftone-pattern-edge-fade-and-alignment.md`](04-halftone-pattern-edge-fade-and-alignment.md) | `Pending` | Halftone pattern edge fade-out (tapering dot radius & pitch, zero clipped dots), offsets locked to Figma exports |

---

## Execution & Handoff Protocol

Any AI agent working on these tasks must follow this protocol:
1. **Atomic Execution**: Complete tasks strictly in numerical order (01 through 04).
2. **Individual Backups**: After completing each task, create a Studio backup export:
   ```bash
   studio export --path="$PWD" /tmp/refinements-task-XX.zip
   ```
   Update the task documentation status to `Complete`, stage files, and push via:
   ```bash
   ./scripts/push.sh "Task XX: <commit message>" /tmp/refinements-task-XX.zip
   ```
3. **Record Deviations**: Document any unplanned adjustments in each task file's **Unplanned Changes & Scope Deviations** section.
4. **Verification**: Verify PHP syntax (`find ... -name '*.php' | xargs -n1 php -l`) and Playwright review suite (`REVIEW_TASK=all node scripts/tests/review.cjs`) before completing every task.

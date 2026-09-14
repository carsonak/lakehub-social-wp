# Website Review Followup & Refinements — 14 September 2026

Master task index and implementation protocol for the followup visual, interactive, and accessibility refinements requested.

---

## Task Tracker

| Task | File | Status | Target Scope |
| :--- | :--- | :--- | :--- |
| **01** | [`01-impact-hover-mask-and-bidirectional-scroll.md`](01-impact-hover-mask-and-bidirectional-scroll.md) | `Complete` | "Impact through Precision": Hover zoom on masking text only; bidirectional entry/exit scroll animations; animated separating lines |
| **02** | [`02-viewport-quarter-scroll-triggers.md`](02-viewport-quarter-scroll-triggers.md) | `Complete` | 1/4 (25%) viewport threshold triggers for Impact metrics and Our Other Programs scroll animations |
| **03** | [`03-revert-dynamic-text-resizing-accessibility.md`](03-revert-dynamic-text-resizing-accessibility.md) | `Pending` | Revert `1.25vw` root font-size to restore browser zoom controls with high-resolution layout content cap |
| **04** | [`04-mission-vision-right-border-anchoring.md`](04-mission-vision-right-border-anchoring.md) | `Pending` | "Mission & Vision": Anchor center of big diamond 26.5px inside right border; eliminate viewport drift across desktop and tablet |

---

## Agent Handoff & Execution Protocol

Any AI agent working on these tasks must follow this protocol:
1. **Atomic Execution**: Complete tasks strictly in numerical order (01 through 04).
2. **Individual Backups**: After completing each task, create a Studio backup export (`studio export --path="$PWD" /tmp/task-XX.zip`), update the task documentation, stage changes, and push via `./scripts/push.sh "commit message" /tmp/task-XX.zip`.
3. **Record Deviations**: Document any unplanned adjustments in the task file's **Unplanned Changes & Scope Deviations** section.
4. **Verification**: Verify PHP syntax (`find ... -name '*.php' | xargs -n1 php -l`) and run Playwright review suite (`REVIEW_TASK=all node scripts/tests/review.cjs`) before completing every task.

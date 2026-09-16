# Website Review Follow-Up & Visual Polish — 16 September 2026

Follow-up implementation plan addressing 9 user-requested refinements across visual components, text expandability, interactive hover states, newsletter form input, and layout spacing.

---

## Task Tracker

| Task | File | Status | Target Scope |
| :--- | :--- | :--- | :--- |
| **01** | [`01-rectangular-halftone-patterns.md`](01-rectangular-halftone-patterns.md) | `Complete` | Rectangular halftone vignettes with 12px margin, larger edge dots, center anchoring & cursor repulsion |
| **02** | [`02-collapsible-story-read-more-hide.md`](02-collapsible-story-read-more-hide.md) | `Complete` | Collapsible "Read More / Hide" with thick chevron arrow (`down.png`), bottom fade-out after paragraph 1 |
| **03** | [`03-scrolling-logos-hover-and-edge-padding.md`](03-scrolling-logos-hover-and-edge-padding.md) | `Complete` | Restrict pause trigger to logos track only; remove side padding completely (`padding-inline: 0`) |
| **04** | [`04-inspiring-portfolios-and-coming-soon-cleanup.md`](04-inspiring-portfolios-and-coming-soon-cleanup.md) | `In Progress` | Route "View More Stories" to `/coming-soon/`; remove redundant "EXPLORE PROGRAMS" button |
| **05** | [`05-metric-numbers-and-nav-bar-hover-interactivity.md`](05-metric-numbers-and-nav-bar-hover-interactivity.md) | `Pending` | Scale metrics by 0.75; nav-bar style hover (lift 2px, underline, transparent bg) for text buttons and footer links |
| **06** | [`06-interactive-newsletter-form.md`](06-interactive-newsletter-form.md) | `Pending` | Convert static newsletter mock to interactive email `<input>` with dark ghost placeholder and submit button |
| **07** | [`07-verification-and-regression-suite.md`](07-verification-and-regression-suite.md) | `Pending` | Playwright test suite for all 9 refinements, PHP linting, shellcheck, visual inspection |

---

## Agent Handoff & Execution Protocol

1. **Atomic Execution**: Complete tasks in numerical order (01 through 07).
2. **Phase-by-Phase Backups**: Immediately after each task, mark the task checklist complete, update this README, run verification, and record an atomic git commit.
3. **No Unstaged Leakage**: Review `git status --short` before committing.

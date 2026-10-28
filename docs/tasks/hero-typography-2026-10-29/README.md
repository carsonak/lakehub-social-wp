# Consistent hero typography — 2026-10-29

User requests consistent hero font size/weight, followed by backup and preview refresh. Use the existing Home responsive scale and weight 800 for primary Home, Programs, About and Impact banner headings. This is a focused typography adjustment, not a new Figma-derived layout; the user's new direction supersedes the differing historical heading sizes.

## Implementation

Reuse the existing `hero-photo` font-size preset. Centralize the four banner H1s in a dedicated hero stylesheet, remove conflicting page-specific size/weight rules and About's smaller inline span size, and load it in both editor and frontend. Use unitless 1.1 line-height to prevent enlarged headings overlapping. Retain banner dimensions, images, colors, brand lockups, content and buttons. Team, Coming Soon, article titles and footer calls to action are not photo hero headings.

| Phase | Description | Status |
| --- | --- | --- |
| 01 | Shared hero styles and focused verification | Complete |
| 02 | Regression checks, full export, conventional commits/R2 backup and Studio preview refresh | Preview blocked by approval review |

## Verification matrix

At 1280, 768 and 390px, compare computed H1 font-size and font-weight across all four banners and About inline span inheritance. Check no text clipping, document overflow or button collision; inspect desktop/mobile captures. Confirm editor loading and existing content remains valid without a markup/database migration. Run project PHP lint, theme static checks, Bash/ShellCheck, and relevant/full browser regression tests. Verify final source/export manifest; refresh the Studio preview and smoke-test the hosted hero typography. Use the existing scripts/push.sh workflow and record returned preview URL/expiry information.

## Baseline

Clean worktree at `49cbe79`. Local Studio was not listening on localhost:8881 during the initial read-only browser inspection. Studio MCP tools were unavailable before the session restart; they became available afterward and handled the fresh exports. The interrupted pre-change ZIP was invalid and was replaced with a successfully completed export.

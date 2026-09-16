# Task 07: Verification, Linting & Regression Testing Baseline

## Objective and Agreed Scope

Establish an automated and manual verification suite confirming that all code changes, layout updates, interactive scripts, and content revisions meet the repository's strict quality and accessibility standards.

---

## 1. Automated Verification Commands

### PHP Syntax Checking
Must pass without any syntax errors or deprecation notices:
```bash
find wp-content/themes/lakehub-social wp-content/plugins/lakehub-site -type f -name '*.php' -print0 | xargs -0 -n1 php -l
```

### Shell Scripts Syntax & Linting
```bash
bash -n scripts/setup.sh scripts/push.sh scripts/pull.sh scripts/lib/common.sh
shellcheck scripts/setup.sh scripts/push.sh scripts/pull.sh scripts/lib/common.sh
```

### WordPress Studio Health Checks
```bash
studio status
studio wp --path="$PWD" core version
studio wp --path="$PWD" theme list
studio wp --path="$PWD" plugin list
```

### Playwright Review Regression Suite
Run the regression suite against local Studio site:
```bash
CHROMIUM_PATH=/usr/bin/google-chrome NODE_PATH=/home/akihara/.studio/cli/node_modules REVIEW_TASK=all node scripts/tests/review.cjs
```

---

## 2. Feature-Specific Verification Matrix

| Area | Check | Expected Result |
| :--- | :--- | :--- |
| **Radial Halftone** | Sizing | Sized to $2R$ ($592\text{px}, 682\text{px}, 602\text{px}$) fully enclosing image |
| **Radial Halftone** | Corner Clearance | Corners sit 6px to 8px inside circumference |
| **Radial Halftone** | Anchoring | Pattern anchored to center in rest position (`translate(-50%, -50%)`) |
| **Radial Halftone** | Hover Repulsion | Image frame repels; pattern counter-transforms to remain stationary |
| **Radial Halftone** | Reduced Motion | Transforms disabled when `prefers-reduced-motion: reduce` |
| **Home Hero** | 4 Slides Endless Cycle | Transitions across all 4 images every 3 seconds endlessly |
| **Home Hero** | No Pause / No Controls | Continuous animation without pause on hover or UI buttons |
| **Home Hero** | Reduced Motion | Animation halted; random slide selected and displayed statically on every reload |
| **Home Hero** | Contrast | Dark overlay (`#002021` 50%) ensures text readability |
| **Team Updates** | Rodgers Kaunda | Stacy Dina replaced; Rodgers Kaunda renders with placeholder avatar and bio |
| **Blog Template** | Single Post | Renders two-column hero, 768px reading column, quote, figure with caption bar |
| **Blog Template** | Social Sharing | Twitter, LinkedIn, Facebook, and copy link functions operate |
| **Blog Template** | Insights Loop | Home page "Latest Insights" cards link directly to published posts |
| **Coming Soon** | Routing | Missing content links route to `/coming-soon/` |
| **Site Copy** | Content Match | 100% fidelity to `home_page.docx`, `about_page.docx`, `impact_page.docx`, `programs_page.docx` |
| **Responsive** | Mobile Viewports | No horizontal overflow on 320px, 390px, 768px, 1024px, 1280px |

---

## Progress & Tracking

- [x] Run PHP syntax checks across theme and plugin
- [x] Run Shellcheck on scripts
- [x] Run Playwright review regression suite (`review-2026-09-16.cjs`)
- [x] Manual inspection of desktop and mobile viewports
- [x] Verify hero slideshow 3-second cycle and reduced-motion randomizer
- [x] Git status clean review before final handoff

## Execution Notes & Observations

- **Automated Regression Suite (`scripts/tests/review-2026-09-16.cjs`)**:
  - Test 1: Radial halftone vignette geometry ($2R$ sizing, 7.01px corner clearance, center anchoring, cursor repulsion, reduced-motion freeze) — **PASSED**.
  - Test 2: Home hero 4-image crossfade slideshow (3s cycle, no pause on hover, no manual controls, reduced-motion random reload freeze) — **PASSED**.
  - Test 3: Blog single post template, author display "LakeHub Team", social share links (Copy, LinkedIn, X, Facebook), and Home insights query loop — **PASSED**.
  - Test 4: Dedicated `/coming-soon/` page, footer links (FAQ, Support, Privacy Policy), and Chichwa Read More link — **PASSED**.
  - Test 5: Site copy updates across Home/About/Impact/Programs and Rodgers Kaunda replacing Stacy Dina on `/team/` — **PASSED**.
  - Test 6: Responsive viewports (320px, 390px, 768px, 1024px, 1280px) across all 7 pages without document horizontal overflow (`scrollWidth <= innerWidth + 1`) — **PASSED**.
- **PHP Linting**: 34 project PHP files checked via `php -l` — **0 syntax errors**.
- **Shellcheck**: `scripts/setup.sh`, `scripts/push.sh`, `scripts/pull.sh`, `scripts/lib/common.sh` — **0 warnings**.
- **Studio Health**: WordPress 7.1, LakeHub Social 3.2.3, LakeHub Site 1.2.1, SQLite — **🟢 Online**.


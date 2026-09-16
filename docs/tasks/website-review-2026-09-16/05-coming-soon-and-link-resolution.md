# Task 05: "Coming Soon" Page & Complete Site-Wide Link Resolution

## Objective and Agreed Behavior

1. **"Coming Soon" Page**:
   - The user instructed:
     > "for links that have missing content we can implement a 'Coming Soon' page or link to their relevant websites where applicable."
   - Create a dedicated WordPress page `/coming-soon/` (Page ID, slug `coming-soon`, template `page.html` or pattern `patterns/coming-soon.php`).
   - The Coming Soon page will be styled cleanly using LakeHub tokens:
     - Header
     - Friendly announcement banner:
       - Heading: `Exciting Things Are On The Way`
       - Body: `We are preparing this initiative to expand opportunities, resources, and connections across the LakeHub ecosystem. Check back soon for updates or explore our active programs.`
       - Buttons: `[ Back to Home ]` and `[ Explore Programs ]`
     - Footer

2. **Site-Wide Link Audit & Routing Matrix**:
   Ensure every interactive button, card link, header link, and footer link resolves cleanly without broken destinations or dead `#` anchors:

| Source Location | Link / Button Text | Destination URL | Status |
| :--- | :--- | :--- | :--- |
| **Site Header** | HOME | `/` | Active |
| **Site Header** | ABOUT | `/about/` | Active |
| **Site Header** | PROGRAMS | `/programs/` | Active |
| **Site Header** | IMPACT | `/impact/` | Active |
| **Home Hero** | JOIN THE COMMUNITY | `/about/#community` or `/coming-soon/` | Resolved |
| **Home Hero** | OUR PROGRAMS | `/programs/` | Active |
| **Home Impact Stats** | Software Engineers | `/programs/` | Active |
| **Home Partners** | GIZ | `https://www.giz.de/en/` | External |
| **Home Partners** | Livelihood Impact Fund | `https://www.livelihoodimpactfund.org/` | External |
| **Home Partners** | Partners for Equity | `https://partnersforequity.org/` | External |
| **Home Partners** | German Cooperation | `https://www.giz.de/en/` | External |
| **Home Partners** | AVF | `https://www.segalfamilyfoundation.org/...` | External |
| **Home Insights** | Card Titles & Read More (`→`) | Individual single post URLs (`/from-learning-to-shipping/`, etc.) | Active |
| **Home CTA** | EXPLORE PROGRAMS | `/programs/` | Active |
| **About Hero** | Heading | N/A | Static |
| **About Mission** | Heading | `#mission` | Anchor |
| **About Story** | Heading | `#history` | Anchor |
| **About Team** | Meet The Full Team | `/team/` | Active |
| **Impact Community** | Chichwa Read more | `/coming-soon/` or relevant article | Resolved |
| **Impact Portfolio** | Malika Read more | `https://www.zone01kisumu.ke/` or article | Resolved |
| **Impact Portfolio** | View More People | `/team/` | Active |
| **Impact CTA** | Explore Alumni Stories | `/impact/#portfolios` | Anchor |
| **Impact CTA** | Connect With an Alumnus | `/coming-soon/` | Resolved |
| **Impact CTA** | Partner With Us | `/coming-soon/` | Resolved |
| **Programs Flagship**| View Program | `https://www.zone01kisumu.ke/` | External |
| **Programs Cards** | Learn More (FemiDevs, OYA, etc.) | `/coming-soon/` | Resolved |
| **Programs CTA** | Apply to Zone01 | `https://www.zone01kisumu.ke/` | External |
| **Programs CTA** | Browse Bootcamps | `/programs/#all-programs` | Anchor |
| **Programs CTA** | Talk to Our Team | `/about/#team` | Anchor |
| **Site Footer** | About Us | `/about/` | Active |
| **Site Footer** | Our Mission | `/about/#mission` | Active |
| **Site Footer** | Impact Stories | `/impact/` | Active |
| **Site Footer** | History | `/about/#history` | Active |
| **Site Footer** | FAQ | `/coming-soon/` | Resolved |
| **Site Footer** | Support | `/coming-soon/` | Resolved |
| **Site Footer** | Privacy Policy | `/coming-soon/` | Resolved |
| **Site Footer** | Contact Us | `/coming-soon/` | Resolved |

---

## Detailed Implementation Steps

1. Create `patterns/coming-soon.php` block pattern.
2. Create WordPress page `Coming Soon` with slug `coming-soon` via WP-CLI.
3. Update `patterns/site-footer.php` with all resolved URLs.
4. Update `patterns/impact-page.php`, `patterns/programs-hero.php`, `patterns/programs-list.php`, and `patterns/home-cta.php` with the link matrix.
5. Update database post contents via WP-CLI to ensure database copies match canonical theme patterns.

---

## Progress & Tracking

- [x] Create `patterns/coming-soon.php`
- [x] Create `/coming-soon/` page in WordPress database (Page ID 220)
- [x] Audit and update footer links in `patterns/site-footer.php` (FAQ, Support, Privacy Policy -> `/coming-soon/`, active social links)
- [x] Audit and update card links in Home, About, Impact, Programs (`View Program` -> `https://www.zone01kisumu.ke/`, `Read more →` -> `/coming-soon/`, `View More People` -> `/team/`)
- [x] Verify every link in automated tests (Playwright link resolution test passed with 0 broken links)

## Unplanned Changes & Scope Deviations

None. Added fallback in `lakehub-site` programs block render template so unset program card links default safely to `/coming-soon/`.


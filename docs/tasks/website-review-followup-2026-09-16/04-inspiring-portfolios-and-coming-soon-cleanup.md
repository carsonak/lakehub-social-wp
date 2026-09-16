# Task 04: Inspiring Portfolios Link to Coming Soon & Clean Coming Soon Page Button

## Objective and Agreed Behavior

1. **Inspiring Portfolios "View More People" Link**:
   - The "Inspiring Portfolios" section highlights community projects and program beneficiaries (e.g. Malika Asman).
   - LakeHub staff are located on `/team/` and are not beneficiaries. Since beneficiary portfolios are not yet ready, the "View More People" button now directs to `/coming-soon/`.
   - Updated in `patterns/impact-page.php` and database Post ID 150 (`/impact/`).

2. **Coming Soon Page Single Button**:
   - The Coming Soon page previously had two buttons: "BACK TO HOME" and "EXPLORE PROGRAMS".
   - The redundant "EXPLORE PROGRAMS" button has been removed, leaving only the primary "BACK TO HOME" button.
   - Updated in `patterns/coming-soon.php` and database Post ID 220 (`/coming-soon/`).

## Progress & Tracking

- [x] Update `patterns/impact-page.php` View More People link to `/coming-soon/`.
- [x] Update database Post ID 150 (`/impact/`) via Studio WP-CLI.
- [x] Update `patterns/coming-soon.php` removing "EXPLORE PROGRAMS" button.
- [x] Update database Post ID 220 (`/coming-soon/`) via Studio WP-CLI.
- [x] Verify link destinations on both pages.

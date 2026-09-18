# Task 05: Verification & Regression Testing

## Scope & Objective
Run the full verification suite across all modified theme code:
1. PHP syntax validation (`php -l` on all theme/plugin files).
2. Shell script validation (`bash -n` and `shellcheck`).
3. WordPress Studio runtime health checks (`studio status`, `studio wp core version`, `studio wp theme list`).
4. Visual and functional verification of all interactive components (carousel, slideshow, 3D tilt, sticky header, single blog post, mobile menu).
5. Site Editor parity verification (ensuring block editor renders styles cleanly without recovery errors).

## Checklist
- [ ] Run PHP syntax linting.
- [ ] Run shell script validation.
- [ ] Run WordPress Studio CLI health commands.
- [ ] Verify frontend rendering and browser console (zero JS errors).
- [ ] Verify Site Editor styling.

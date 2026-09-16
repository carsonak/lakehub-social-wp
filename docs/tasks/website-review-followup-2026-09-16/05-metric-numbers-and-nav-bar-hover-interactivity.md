# Task 05: Metric Numbers Scaling (0.75x) & Nav-Bar Style Button/Link Hover

## Objective and Agreed Behavior

1. **Metric Numbers Scaled to 3/4 Size**:
   - Reduce the font size of the numbers in the metric section of the "Home" page to 75% ($0.75\times$) of their previous size.
   - `theme.json`: `metric` preset scaled:
     - `size`: `7.96875rem` (was `10.625rem`)
     - `fluid.min`: `4.5rem` (was `6rem`)
     - `fluid.max`: `7.96875rem` (was `10.625rem`)
   - `style.css`:
     - Desktop letter spacing: `-0.234rem` (was `-0.3125rem`)
     - Medium breakpoint clamp: `clamp(4.5rem, 9.75vw, 7.97rem)` (was `clamp(6rem, 13vw, 10.625rem)`)
     - Mobile breakpoint: `5.156rem` (was `6.875rem`)

2. **Nav-Bar Style Hover Interactivity**:
   - For all buttons/links that say "Read more", "Learn more", "View More People", optional-action buttons, and footer navigation links:
     - **No background color change** (`background: transparent !important; border-color: transparent !important;`).
     - **Text lifts up slightly** (`transform: translateY(-0.125rem);`).
     - **Underline appears** (`text-decoration: underline; text-underline-offset: 0.25rem;`).
     - Preserves teal color on content links/buttons, white color on footer links.
     - Respects `prefers-reduced-motion: reduce`.

## Progress & Tracking

- [x] Update `theme.json` metric font size preset to 7.96875rem (min 4.5rem, max 7.96875rem).
- [x] Update `style.css` letter spacing, tablet clamp, and mobile metric font size.
- [x] Exclude optional action buttons from solid button hover fills.
- [x] Add nav-bar style hover lift and underline to text buttons, cards, and footer links in `style.css`.
- [x] Verify visual appearance and hover states across viewports.

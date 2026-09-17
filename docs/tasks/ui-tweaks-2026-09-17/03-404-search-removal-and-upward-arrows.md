# Task 03: 404 Search Removal & Upward Top-Right Navigation Arrows

## Objective and Agreed Behavior

1. **Remove Search Function from 404 Pages**:
   - `templates/404.html`: Remove `core/search` block and "Try searching for what you need" paragraph.
   - Display a clean, welcoming 404 page:
     - Heading: "Page not found"
     - Paragraph: "The page you are looking for does not exist or has been moved."
     - Navigation: A clean button linking back to Home (`href="/"`) using `.wp-block-button`.

2. **Upward Top-Right Arrow Icons**:
   - Buttons or links that redirect to another page and have an arrow icon must use an upward diagonal arrow icon matching [Flaticon 7242785](https://www.flaticon.com/free-icon/top-right_7242785) (top-right diagonal vector with rounded cap and join).
   - "Latest Insights" card read-more link: replace `➜` with the upward top-right arrow mask/vector.
   - Impact page "Community Projects": replace `Read more →` with `Read more` followed by the upward top-right arrow icon.

## Progress & Tracking

- [x] Update `templates/404.html` to remove search and provide a friendly Return to Home button.
- [x] Define top-right diagonal upward arrow icon in CSS and SVG.
- [x] Update `patterns/impact-page.php` Community Projects button from `→` to top-right arrow.
- [x] Update Latest Insights card arrow from `➜` to top-right upward arrow.
- [x] Verify 404 template and arrow rendering in browser.

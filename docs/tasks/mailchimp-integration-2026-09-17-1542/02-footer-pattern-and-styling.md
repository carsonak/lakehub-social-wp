# Task 02: Footer Pattern and Theme Styling

## Objective and Agreed Behavior

1. **Footer Pattern Update**:
   - In `wp-content/themes/lakehub-social/patterns/site-footer.php`:
     Replace static dummy `<form class="is-style-lakehub-newsletter" action="#" method="post">` with:
     ```html
     <!-- wp:shortcode -->
     [mc4wp_form]
     <!-- /wp:shortcode -->
     ```
   - When rendered by WordPress on the frontend, this evaluates MC4WP's canonical newsletter form with the exact same pill markup:
     `<div class="is-style-lakehub-newsletter"><input type="email" name="EMAIL" ... /><button type="submit" ...>Subscribe</button></div>`.

2. **Theme CSS Styling for MC4WP**:
   - In `wp-content/themes/lakehub-social/style.css`:
     Add rules for `.mc4wp-form`:
     - `.mc4wp-form { width: 100%; margin-top: 0.75rem; }`
     - `.mc4wp-form .is-style-lakehub-newsletter { margin-top: 0; }`
     - `.mc4wp-form .mc4wp-response { margin-top: 0.625rem; font-size: 0.875rem; line-height: 1.35; }`
     - `.mc4wp-form .mc4wp-alert { margin: 0; padding: 0.625rem 1rem; border-radius: 0.5rem; font-family: var(--wp--preset--font-family--inter, sans-serif); }`
     - `.mc4wp-form .mc4wp-success { background: rgba(0, 103, 107, 0.25); border: 1px solid var(--lakehub-teal, #00676B); color: #c9ecee; }`
     - `.mc4wp-form .mc4wp-error { background: rgba(220, 38, 38, 0.2); border: 1px solid rgba(248, 113, 113, 0.4); color: #fecaca; }`
     - `.mc4wp-form .mc4wp-notice { background: rgba(59, 130, 246, 0.2); border: 1px solid rgba(96, 165, 250, 0.4); color: #bfdbfe; }`

3. **Form JavaScript Submission**:
   - In `wp-content/themes/lakehub-social/assets/js/main.js`:
     Remove `event.preventDefault()` from newsletter submission so MC4WP handles submission cleanly, providing submitting state feedback (`Subscribing...`).

- [x] Update `patterns/site-footer.php` with `<!-- wp:mailchimp-for-wp/form /-->` block (native block renderer for MC4WP).
- [x] Add `.mc4wp-form` and alert styles to `style.css`.
- [x] Update `main.js` newsletter submission listener to allow MC4WP form submission with loading feedback.
- [x] Verify footer rendering in browser.


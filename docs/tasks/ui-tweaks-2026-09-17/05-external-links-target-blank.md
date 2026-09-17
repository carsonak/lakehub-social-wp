# Task 05: External Links Target `_blank`

## Objective and Agreed Behavior

1. **Target `_blank` on External Links**:
   - Any button or link that redirects to an external site must open in a new tab (`target="_blank"`).
   - Must include `rel="noopener noreferrer"` for security and performance.
   - Applies across:
     - Home page partner logos (`patterns/home-partners.php` & post 11 content)
     - Footer social links (`patterns/site-footer.php`)
     - Programs external links (e.g. Zone01 Kisumu)
     - Any user-authored or future external links via progressive enhancement in `main.js`.

## Progress & Tracking

- [x] Update `patterns/home-partners.php` with `target="_blank" rel="noopener noreferrer"`.
- [x] Update Home page (post 11) in SQLite database to match pattern.
- [x] Add client-side safety guard in `wp-content/themes/lakehub-social/assets/js/main.js` to automatically ensure all external anchors open in a new tab with `rel="noopener noreferrer"`.
- [x] Verify external links open in a new tab with `target="_blank"` and `noopener noreferrer`.

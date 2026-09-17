# Task 01: Form Registration and Defaults

## Objective and Agreed Behavior

1. **Canonical MC4WP Form Creation**:
   - Programmatically ensure the canonical `mc4wp-form` post exists in WordPress.
   - Title: `LakeHub Newsletter`.
   - Content:
     ```html
     <div class="is-style-lakehub-newsletter">
       <input type="email" name="EMAIL" class="lakehub-newsletter-input" placeholder="example@gmail.com" aria-label="Your email address" required />
       <button type="submit" class="is-style-lakehub-newsletter-label">Subscribe</button>
     </div>
     ```
   - Meta `_mc4wp_settings`:
     - `lists`: `['150232a912']` (LakeHub Social audience list)
     - `double_optin`: `1` (Mailchimp sends confirmation of subscription email)
     - `update_existing`: `1`
     - `replace_interests`: `1`
     - `subscriber_tags`: `website, newsletter`
   - Meta `_mc4wp_messages`:
     - `subscribed`: "Thank you for subscribing! Please check your email to confirm your subscription."
     - `invalid_email`: "Please provide a valid email address."
     - `already_subscribed`: "You are already subscribed to the LakeHub newsletter!"
     - `error`: "Oops! An error occurred while processing your subscription. Please try again."

2. **Idempotent Seeding & WP-CLI Command**:
   - Provide `lakehub_ensure_newsletter_form()` in `wp-content/plugins/lakehub-site/includes/newsletter.php`.
   - Register WP-CLI command: `studio wp lakehub newsletter setup`.
   - Automatically ensure form exists on `init` if `post_type = 'mc4wp-form'` has 0 posts.

## Progress & Tracking

- [x] Create `wp-content/plugins/lakehub-site/includes/newsletter.php` with form registration and WP-CLI command.
- [x] Load `newsletter.php` in `wp-content/plugins/lakehub-site/lakehub-site.php`.
- [x] Execute `studio wp lakehub newsletter setup` and verify canonical `mc4wp-form` post in SQLite.
- [x] Run PHP syntax checks across plugin files.

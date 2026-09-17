# Task 03: Confirmation Email Hook (Two-Tier Delivery)

## Objective and Agreed Behavior

1. **Email Sender & Hook**:
   - In `wp-content/plugins/lakehub-site/includes/newsletter.php`:
     - Implement `lakehub_send_newsletter_confirmation( $email, $data = [] )`.
     - Dynamically use `get_option('admin_email')` for the `From` header: `From: LakeHub Social <" . get_option('admin_email') . ">`. This satisfies the requirement to accommodate testing while official LakeHub email permissions are being finalized.
     - Hook `add_action( 'mc4wp_form_subscribed', function( $form, $email, $data ) { lakehub_send_newsletter_confirmation( $email, $data ); }, 10, 3 );`.
     - Add WP-CLI test command: `lakehub newsletter test-email <email>`.
     - Record outbound email details in transient `lakehub_last_newsletter_email` for verification and auditing.

2. **Email Content & Structure**:
   - LakeHub brand colors: Teal `#00676B`, Charcoal `#1F2937`, Light `#F8FAFC`.
   - Content: Welcome greeting, appreciation for subscribing, highlights of LakeHub Social impact and programs, notice about Mailchimp confirmation link for preferences, and direct link back to `home_url()`.

## Progress & Tracking

- [x] Implement `lakehub_send_newsletter_confirmation()` function with branded HTML template.
- [x] Use dynamic `get_option('admin_email')` for sender address.
- [x] Hook `mc4wp_form_subscribed` action.
- [x] Add WP-CLI `lakehub newsletter test-email` command.
- [x] Verify CLI email dispatch and transient persistence.

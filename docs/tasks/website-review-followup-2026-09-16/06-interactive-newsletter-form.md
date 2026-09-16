# Task 06: Interactive Newsletter Form & Ghost Text Styling

## Objective and Agreed Behavior

1. **Interactive Email Form**:
   - Replace the static `<p>example@gmail.com</p>` mock with an interactive `<form class="is-style-lakehub-newsletter">`.
   - Contains an email input: `<input type="email" class="lakehub-newsletter-input" placeholder="example@gmail.com" aria-label="Your email address" required />`.
   - Contains a submit button: `<button type="submit" class="is-style-lakehub-newsletter-label">Subscribe</button>`.
   - When submitted, prevents standard navigation reload and provides responsive confirmation feedback ("Subscribed!").

2. **Dark Ghost Text Placeholder Styling**:
   - The input placeholder is styled with darker ghost text (`rgba(255, 255, 255, 0.4)`), giving it a ghosted appearance against the dark footer background.
   - On input focus, placeholder fades to `rgba(255, 255, 255, 0.25)`.
   - Text typed by the user renders in crisp, full-opacity white.

## Progress & Tracking

- [x] Update `patterns/site-footer.php` with `<form>` markup, `<input type="email">`, and submit button.
- [x] Style `.lakehub-newsletter-input` and ghost placeholder in `style.css`.
- [x] Add client-side submission feedback handler in `assets/js/main.js`.
- [x] Verify typing and submission behavior.

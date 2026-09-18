# Task 03: CSS Modularisation (`style.css`)

## Scope & Objective
Extract specialized section styles, layout components, and templates from `wp-content/themes/lakehub-social/style.css` into dedicated files under `assets/css/`:
- Retain core tokens, resets, base typography, and button/link tokens in `style.css`.
- `assets/css/navigation-header.css`: Header, navigation overlay, and mobile responsive menu.
- `assets/css/footer.css`: Footer layout, newsletter preview, and social links.
- `assets/css/single-post.css`: Blog Post Single template layout, social shares, and author box.
- `assets/css/coming-soon.css`: Coming soon section styling.
- `assets/css/sections.css`: Reusable sections (Hero, Impact, Transformation, Journey timeline, Mission collage, Metrics).
- `assets/css/partners.css`: Partner logos carousel and hover behaviors.
- `assets/css/insights.css`: Query loop cards, excerpt fade, and arrow-bounce animation.
- Update `inc/enqueue.php` to register/enqueue stylesheets and update `add_editor_style()`.

## Checklist
- [ ] Create `assets/css/navigation-header.css`.
- [ ] Create `assets/css/footer.css`.
- [ ] Create `assets/css/single-post.css`.
- [ ] Create `assets/css/coming-soon.css`.
- [ ] Create `assets/css/sections.css`.
- [ ] Create `assets/css/partners.css`.
- [ ] Create `assets/css/insights.css`.
- [ ] Streamline `style.css` to base reset and design tokens.
- [ ] Update `inc/enqueue.php` with modular enqueue and `add_editor_style()`.
- [ ] Verify frontend and editor style parity.

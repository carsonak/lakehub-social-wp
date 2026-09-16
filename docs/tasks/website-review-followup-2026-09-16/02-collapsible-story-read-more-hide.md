# Task 02: Collapsible "Read More / Hide" Component

## Objective and Agreed Behavior

1. **Collapsible Text with Fade-out**:
   - For multi-paragraph text sections (About page "Our Story", `.is-style-lakehub-story-copy`), text starts to fade out after the first paragraph.
   - Paragraph 1 remains fully visible.
   - Subsequent paragraphs begin inside a preview container with bottom fade-out gradient mask (`-webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%)`).

2. **Toggle Buttons & Thick Chevron Icon**:
   - The button has **no fill and no border** (`background: transparent; border: none;`).
   - The button displays a thick rounded chevron arrow matching `down.png` (Flaticon 2722987) with `stroke-width="4"` and round caps/joins.
   - The arrow points in the direction of text movement:
     - "Read More" button points **downward** (`∨`), indicating downward expansion.
     - "Hide" button is positioned at the very end of the revealed text and points **upward** (`∧`), indicating upward collapse.
   - Interactivity: on hover/focus, lifts by 2px (`translateY(-0.125rem)`), underlines text, and preserves teal color without background fill.
   - Accessible ARIA attributes (`aria-expanded`, `aria-label`).

## Progress & Tracking

- [x] Implement collapsible drawer and toggle buttons in `assets/js/main.js`.
- [x] Style `.lakehub-collapsible-drawer`, gradient fade-out mask, and `.lakehub-text-toggle-btn` in `style.css`.
- [x] Verify expansion, collapse, direction chevrons, and smooth scrolling.

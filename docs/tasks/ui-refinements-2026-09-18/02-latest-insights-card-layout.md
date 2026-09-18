# Task 02: Latest Insights Card Layout & Arrow Bounce Animation

## Scope & Checklists

- [ ] Update `style.css` for `.is-style-lakehub-insight-copy h3` to clamp to 3 lines with ellipsis (`-webkit-line-clamp: 3; height: 4.21875rem`).
- [ ] Ensure the excerpt begins at the same vertical position across cards.
- [ ] Add linear-gradient mask to excerpt text so it fades out completely before the arrow line.
- [ ] Anchor the read-more arrow button at a fixed position at the bottom-right (`position: absolute; bottom: 1.75rem; right: 1.5rem;`), decoupled from text length.
- [ ] Set copy container bottom padding larger than side padding (`padding: 1.5rem 1.5rem 2.25rem 1.5rem`).
- [ ] Increase bounce animation duration to `2.4s`.
- [ ] Update `main.js` and `style.css` so bounce animation triggers *only* on arrow button hover, runs to completion if the pointer leaves, stops after 1 iteration if the pointer stays, and resets cleanly on re-hover.
- [ ] Run verification tests for Phase 02 and create an atomic Git commit.
